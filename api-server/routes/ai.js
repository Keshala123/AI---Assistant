const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// n8n webhook URL (will be configured later)
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';

/**
 * 🤖 Main AI Chat Endpoint
 * Processes user messages and returns AI responses
 */
router.post('/chat', [
  body('message').isLength({ min: 1 }).trim(),
  body('language').isIn(['en', 'si', 'ta']),
  body('currentScreen').optional().isString(),
  body('userRole').optional().isIn(['farmer', 'labor', 'driver'])
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      message,
      language = 'en',
      currentScreen = 'unknown',
      userRole = 'farmer',
      context = {},
      isVoiceInput = false
    } = req.body;

    // Prepare payload for n8n workflow
    const aiPayload = {
      message,
      language,
      currentScreen,
      userRole,
      context,
      isVoiceInput,
      timestamp: new Date().toISOString(),
      sessionId: req.headers['session-id'] || 'anonymous'
    };

    // Send to n8n workflow
    const n8nResponse = await axios.post(`${N8N_WEBHOOK_URL}/ai-chat`, aiPayload, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Return AI response
    res.json({
      success: true,
      data: n8nResponse.data
    });

  } catch (error) {
    console.error('AI Chat Error:', error.message);
    
    // Fallback response
    const fallbackResponse = {
      message: language === 'si' ? 'සමවන්න, දැන් ගැටලුවක් ඇත. නැවත උත්සාහ කරන්න.' :
               language === 'ta' ? 'மன்னிக்கவும், எனக்கு இப்போது சிக்கல் உள்ளது. மீண்டும் முயற்சி செய்யவும்.' :
               'Sorry, I\'m having trouble right now. Please try again.',
      language,
      hasAudio: false,
      quickActions: []
    };

    res.status(200).json({
      success: true,
      data: fallbackResponse
    });
  }
});

/**
 * 🎯 Contextual Help Endpoint
 * Provides screen-specific assistance
 */
router.get('/help/:screenName', async (req, res) => {
  try {
    const { screenName } = req.params;
    const { language = 'en', userRole = 'farmer' } = req.query;

    const helpPayload = {
      screenName,
      language,
      userRole,
      requestType: 'contextual_help'
    };

    const n8nResponse = await axios.post(`${N8N_WEBHOOK_URL}/contextual-help`, helpPayload);

    res.json({
      success: true,
      data: n8nResponse.data
    });

  } catch (error) {
    console.error('Contextual Help Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get contextual help'
    });
  }
});

/**
 * 🎙️ Voice Message Endpoint
 * Handles voice input processing
 */
router.post('/voice', async (req, res) => {
  try {
    // This endpoint will handle voice file uploads
    // and convert them to text before processing
    const { audioData, language = 'en', currentScreen } = req.body;

    // Send to n8n voice processing workflow
    const voicePayload = {
      audioData,
      language,
      currentScreen,
      processingType: 'voice_to_text_and_respond'
    };

    const n8nResponse = await axios.post(`${N8N_WEBHOOK_URL}/voice-process`, voicePayload);

    res.json({
      success: true,
      data: n8nResponse.data
    });

  } catch (error) {
    console.error('Voice Processing Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice input'
    });
  }
});

/**
 * 🧠 Smart Suggestions Endpoint
 * Provides intelligent suggestions based on user behavior
 */
router.post('/suggestions', async (req, res) => {
  try {
    const {
      userBehavior,
      currentScreen,
      language = 'en',
      userRole = 'farmer'
    } = req.body;

    const suggestionPayload = {
      userBehavior,
      currentScreen,
      language,
      userRole,
      requestType: 'smart_suggestions'
    };

    const n8nResponse = await axios.post(`${N8N_WEBHOOK_URL}/smart-suggestions`, suggestionPayload);

    res.json({
      success: true,
      data: n8nResponse.data
    });

  } catch (error) {
    console.error('Smart Suggestions Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get smart suggestions'
    });
  }
});

module.exports = router;