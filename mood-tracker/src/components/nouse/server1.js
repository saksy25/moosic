const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // React app URL
  credentials: true
}));

app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moosic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

// Mood Entry Schema
const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inputType: {
    type: String,
    enum: ['Text', 'Emoji', 'Voice', 'Image'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  detectedMood: {
    type: String,
    required: true
  },
  moodScore: {
    type: Number,
    min: 1,
    max: 10
  },
  analysis: {
    type: String,
    required: true
  },
  suggestions: [{
    type: String
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Middleware to verify JWT
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Emoji to mood mapping
const emojiMoodMap = {
  '😊': { mood: 'happy', score: 8 },
  '😢': { mood: 'sad', score: 3 },
  '😡': { mood: 'angry', score: 4 },
  '😴': { mood: 'tired', score: 5 },
  '😍': { mood: 'love', score: 9 },
  '😰': { mood: 'anxious', score: 3 },
  '🤔': { mood: 'thoughtful', score: 6 },
  '😎': { mood: 'confident', score: 8 },
  '🥳': { mood: 'excited', score: 9 },
  '😔': { mood: 'disappointed', score: 4 },
  '🤗': { mood: 'affectionate', score: 8 },
  '😤': { mood: 'frustrated', score: 4 }
};

// Mood analysis function
const analyzeMoodWithAI = async (inputType, content) => {
  try {
    let prompt = '';
    
    if (inputType === 'Emoji') {
      const emojiData = emojiMoodMap[content.split(': ')[1]] || { mood: 'neutral', score: 5 };
      prompt = `A user selected the emoji "${content.split(': ')[1]}" to express their mood. Based on this emoji which typically represents ${emojiData.mood} feelings:

1. Provide a 2-line empathetic analysis of their current emotional state
2. Give 1 line of kind, actionable suggestion to help them

Format your response as:
ANALYSIS: [2 lines about their mood]
SUGGESTION: [1 line actionable advice]`;
    } else if (inputType === 'Text') {
      prompt = `A user wrote about their feelings: "${content}"

Based on their text:
1. Provide a 2-line empathetic analysis of their current emotional state
2. Give 1 line of kind, actionable suggestion to help them

Format your response as:
ANALYSIS: [2 lines about their mood]
SUGGESTION: [1 line actionable advice]`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a compassionate emotional support AI. Always be empathetic, understanding, and provide helpful suggestions. Keep responses concise but meaningful.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const response = completion.choices[0].message.content.trim();
    
    // Parse the response
    const analysisMatch = response.match(/ANALYSIS:\s*(.*?)(?=SUGGESTION:|$)/s);
    const suggestionMatch = response.match(/SUGGESTION:\s*(.*?)$/s);
    
    const analysis = analysisMatch ? analysisMatch[1].trim() : response;
    const suggestion = suggestionMatch ? suggestionMatch[1].trim() : 'Take some time for self-care today.';
    
    return { analysis, suggestion };
  } catch (error) {
    console.error('AI Analysis error:', error);
    return {
      analysis: 'I understand you\'re sharing your feelings with me today. Remember that all emotions are valid and temporary.',
      suggestion: 'Take a deep breath and be kind to yourself.'
    };
  }
};

// Detect mood from text or emoji
const detectMood = (inputType, content) => {
  if (inputType === 'Emoji') {
    const emoji = content.split(': ')[1];
    return emojiMoodMap[emoji] || { mood: 'neutral', score: 5 };
  }
  
  // Simple text-based mood detection
  const text = content.toLowerCase();
  if (text.includes('happy') || text.includes('joy') || text.includes('great') || text.includes('awesome')) {
    return { mood: 'happy', score: 8 };
  } else if (text.includes('sad') || text.includes('depressed') || text.includes('down') || text.includes('cry')) {
    return { mood: 'sad', score: 3 };
  } else if (text.includes('angry') || text.includes('mad') || text.includes('furious') || text.includes('hate')) {
    return { mood: 'angry', score: 4 };
  } else if (text.includes('anxious') || text.includes('worried') || text.includes('nervous') || text.includes('stress')) {
    return { mood: 'anxious', score: 3 };
  } else if (text.includes('tired') || text.includes('exhausted') || text.includes('sleepy')) {
    return { mood: 'tired', score: 5 };
  } else {
    return { mood: 'neutral', score: 6 };
  }
};

// Routes

// Sign Up Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Server error during signup' 
    });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login' 
    });
  }
});

// Get current user (protected route)
app.get('/api/auth/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

// Logout route (optional - mainly for clearing token on client side)
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Enhanced Mood analysis route
app.post('/api/analyze-mood', async (req, res) => {
  try {
    const { inputType, content, userId } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'No content provided' });
    }

    // Detect mood
    const moodData = detectMood(inputType, content);
    
    // Get AI analysis
    const aiResponse = await analyzeMoodWithAI(inputType, content);
    
    // Prepare response
    const responseData = {
      detectedMood: moodData.mood,
      moodScore: moodData.score,
      analysis: aiResponse.analysis,
      suggestion: aiResponse.suggestion,
      inputType,
      timestamp: new Date()
    };

    // Save to database if userId is provided
    if (userId) {
      try {
        const moodEntry = new MoodEntry({
          userId,
          inputType,
          content,
          detectedMood: moodData.mood,
          moodScore: moodData.score,
          analysis: aiResponse.analysis,
          suggestions: [aiResponse.suggestion]
        });
        
        await moodEntry.save();
        responseData.saved = true;
      } catch (dbError) {
        console.error('Database save error:', dbError);
        responseData.saved = false;
      }
    }

    res.json(responseData);
  } catch (error) {
    console.error('Mood analysis error:', error);
    res.status(500).json({ 
      error: 'Error analyzing mood',
      analysis: 'I understand you\'re sharing your feelings with me. Remember that it\'s okay to have different emotions throughout the day.',
      suggestion: 'Take a moment to breathe deeply and be gentle with yourself.'
    });
  }
});

// Get user's mood history
app.get('/api/mood-history', auth, async (req, res) => {
  try {
    const moodHistory = await MoodEntry.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({ moodHistory });
  } catch (error) {
    console.error('Mood history error:', error);
    res.status(500).json({ error: 'Error fetching mood history' });
  }
});

// Get mood statistics
app.get('/api/mood-stats', auth, async (req, res) => {
  try {
    const stats = await MoodEntry.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$detectedMood',
          count: { $sum: 1 },
          avgScore: { $avg: '$moodScore' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({ stats });
  } catch (error) {
    console.error('Mood stats error:', error);
    res.status(500).json({ error: 'Error fetching mood statistics' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});