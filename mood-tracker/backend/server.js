
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import fetch from 'node-fetch'; // If not installed, run: npm install node-fetch
import axios from 'axios';
import querystring from 'querystring';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // React app URL
  credentials: true
}));

app.use(bodyParser.json());

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


let spotifyToken = null;
let tokenExpiry = null;

const getSpotifyToken = async () => {
  if (spotifyToken && tokenExpiry && Date.now() < tokenExpiry) {
    return spotifyToken;
  }

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      querystring.stringify({
        grant_type: 'client_credentials'
      }), {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    spotifyToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    return spotifyToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    throw error;
  }
};

// Mood to search terms mapping
const getMoodSearchTerms = (analysis) => {
  const text = analysis.toLowerCase();
  
  if (text.includes('happy') || text.includes('joy') || text.includes('excited')) {
    return {
      spotify: ['happy', 'upbeat', 'cheerful', 'energetic'],
      youtube: 'happy mood boost meditation',
      books: 'happiness positive psychology'
    };
  } else if (text.includes('sad') || text.includes('down') || text.includes('depressed')) {
    return {
      spotify: ['sad', 'melancholy', 'comfort', 'healing'],
      youtube: 'depression help meditation therapy',
      books: 'depression recovery self help'
    };
  } else if (text.includes('anxious') || text.includes('worry') || text.includes('stress')) {
    return {
      spotify: ['calm', 'relaxing', 'peaceful', 'anxiety relief'],
      youtube: 'anxiety relief meditation breathing',
      books: 'anxiety management mindfulness'
    };
  } else if (text.includes('angry') || text.includes('frustrated') || text.includes('mad')) {
    return {
      spotify: ['calm', 'soothing', 'anger management', 'peaceful'],
      youtube: 'anger management meditation calm',
      books: 'anger management emotional regulation'
    };
  } else if (text.includes('tired') || text.includes('exhausted') || text.includes('fatigue')) {
    return {
      spotify: ['energizing', 'motivational', 'uplifting', 'boost'],
      youtube: 'energy boost meditation motivation',
      books: 'energy management productivity'
    };
  } else {
    return {
      spotify: ['peaceful', 'calm', 'relaxing', 'mindful'],
      youtube: 'mindfulness meditation wellness',
      books: 'mental health wellness'
    };
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

app.post('/api/analyze-mood', async (req, res) => {
  const { inputType, content } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Please provide valid content to analyze' });
  }

  let prompt = '';

  if (inputType === 'Emoji') {
    const emojiMap = {
      '😊': 'happy', '😢': 'sad', '😡': 'angry', '😴': 'tired',
      '😍': 'loving', '😰': 'anxious', '🤔': 'thoughtful',
      '😎': 'confident', '🥳': 'celebratory', '😔': 'disappointed',
      '🤗': 'affectionate', '😤': 'frustrated'
    };
    const emotion = emojiMap[content] || 'neutral';
    prompt = `The user shared ${content} indicating they feel ${emotion}. 
Respond with:
1. Two lines of emotional validation
2. One practical suggestion
Keep it warm and supportive.`;
  } else if (inputType === 'Text') {
    prompt = `Analyze this mood text: "${content}".
Provide:
1. Two empathetic validation lines
2. One helpful suggestion
Be compassionate and practical.`;
  } else {
    return res.status(400).json({ error: 'Invalid input type', validTypes: ['Emoji', 'Text'] });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      res.json({ analysis: reply });
    } else {
      res.status(500).json({ error: 'No response from Gemini', data });
    }
  } catch (error) {
    console.error('Gemini REST API error:', error);
    res.status(500).json({ error: 'Error calling Gemini API', details: error.message });
  }
});


// Get mood-based recommendations
app.post('/api/mood-recommendations', async (req, res) => {
  try {
    const { analysis } = req.body;
        
    if (!analysis) {
      return res.status(400).json({ error: 'Analysis is required' });
    }

    const searchTerms = getMoodSearchTerms(analysis);
    const recommendations = {};

    // Get Spotify recommendations
    try {
      const token = await getSpotifyToken();
            
      // Get songs
      const songsPromises = searchTerms.spotify.slice(0, 2).map(async (term) => {
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: {
            q: `${term} mood`,
            type: 'track',
            limit: 3
          }
        });
        return response.data.tracks.items;
      });

      const songsResults = await Promise.all(songsPromises);
      recommendations.songs = songsResults.flat().slice(0, 6)
        .filter(track => track && track.id) // Filter out null/undefined tracks
        .map(track => ({
          id: track.id,
          title: track.name,
          artist: track.artists?.[0]?.name || 'Unknown Artist',
          url: track.external_urls?.spotify,
          preview_url: track.preview_url,
          image: track.album?.images?.[0]?.url || null // Safe access with fallback
        }));

      // Get playlists
      const playlistsPromises = searchTerms.spotify.slice(0, 2).map(async (term) => {
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: {
            q: `${term} therapy wellness`,
            type: 'playlist',
            limit: 2
          }
        });
        return response.data.playlists.items;
      });

      const playlistsResults = await Promise.all(playlistsPromises);
      recommendations.playlists = playlistsResults.flat().slice(0, 4)
        .filter(playlist => playlist && playlist.id) // Filter out null/undefined playlists
        .map(playlist => ({
          id: playlist.id,
          title: playlist.name,
          description: playlist.description || '',
          url: playlist.external_urls?.spotify,
          image: playlist.images?.[0]?.url || null, // Safe access with fallback
          tracks: playlist.tracks?.total || 0
        }));

    } catch (error) {
      console.error('Spotify API error:', error.response?.data || error.message);
      recommendations.songs = [];
      recommendations.playlists = [];
    }

    // Get YouTube videos
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          q: searchTerms.youtube,
          part: 'snippet',
          type: 'video',
          maxResults: 4,
          videoDuration: 'medium'
        }
      });

      recommendations.videos = response.data.items.map(video => ({
        id: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.medium.url,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        channel: video.snippet.channelTitle
      }));
    } catch (error) {
      console.error('YouTube API error:', error);
      recommendations.videos = [];
    }

    // Get book recommendations (using Google Books API - free)
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
        params: {
          q: searchTerms.books,
          maxResults: 4,
          orderBy: 'relevance'
        }
      });

      recommendations.books = response.data.items?.map(book => ({
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
        description: book.volumeInfo.description,
        thumbnail: book.volumeInfo.imageLinks?.thumbnail,
        previewLink: book.volumeInfo.previewLink,
        infoLink: book.volumeInfo.infoLink
      })) || [];
    } catch (error) {
      console.error('Google Books API error:', error);
      recommendations.books = [];
    }

    res.json({ recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});