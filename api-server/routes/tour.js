const express = require('express');
const router = express.Router();

/**
 * 🎯 Guided Tour Routes
 * Provides step-by-step tours for different user roles
 */

// Tour definitions for different user roles
const tourDefinitions = {
  farmer: {
    dashboard: [
      {
        id: 'welcome',
        title: {
          en: 'Welcome to Wee Saviya!',
          si: 'වී සවියට සාදරයෙන් පිළිගනිමු!',
          ta: 'வீ சவியாவுக்கு வரவேற்கிறோம்!'
        },
        description: {
          en: 'This is your farming assistant. Let me show you around.',
          si: 'මෙය ඔබගේ ගොවිතැන් සහායකයා. මම ඔබට මෙහි ඇති දේවල් පෙන්වන්නම්.',
          ta: 'இது உங்கள் விவசாய உதவியாளர். நான் உங்களுக்கு எல்லாவற்றையும் காண்பிக்கிறேன்.'
        },
        targetElement: 'main-dashboard',
        position: 'center',
        showFor: 3000
      },
      {
        id: 'market-rates',
        title: {
          en: 'Check Market Rates',
          si: 'වෙළඳපොළ මිල පරීක්ෂා කරන්න',
          ta: 'சந்தை விலைகளைச் சரிபார்க்கவும்'
        },
        description: {
          en: 'Tap here to see current paddy prices in your district.',
          si: 'ඔබගේ දිස්ත්‍රික්කයේ වත් මිල දැකීමට මෙතන ස්පර්ශ කරන්න.',
          ta: 'உங்கள் மாவட்டத்தில் நெல் விலைகளைப் பார்க்க இங்கே தட்டவும்.'
        },
        targetElement: 'market-button',
        position: 'bottom',
        showFor: 4000
      },
      {
        id: 'weather',
        title: {
          en: 'Weather Information',
          si: 'කාලගුණ තොරතුරු',
          ta: 'வானிலை தகவல்'
        },
        description: {
          en: 'Get weather forecasts important for farming activities.',
          si: 'ගොවිතැන් කටයුතු සඳහා වැදගත් කාලගුණ අනාවැකි ලබා ගන්න.',
          ta: 'விவசாய நடவடிக்கைகளுக்கு முக்கியமான வானிலை முன்னறிவிப்புகளைப் பெறுங்கள்.'
        },
        targetElement: 'weather-button',
        position: 'top',
        showFor: 4000
      },
      {
        id: 'cultivation',
        title: {
          en: 'Cultivation Guide',
          si: 'වගා කිරීමේ මාර්ගෝපදේශය',
          ta: 'சாகுபடி வழிகாட்டி'
        },
        description: {
          en: 'Learn about proper cultivation techniques and timing.',
          si: 'නිසි වගා ක්‍රමවේද සහ කාලසටහන් ගැන ඉගෙන ගන්න.',
          ta: 'சரியான சாகுபடி நுட்பங்கள் மற்றும் நேரம் பற்றி அறிந்து கொள்ளுங்கள்.'
        },
        targetElement: 'cultivation-button',
        position: 'bottom',
        showFor: 4000
      },
      {
        id: 'request-services',
        title: {
          en: 'Request Services',
          si: 'සේවා ඉල්ලීම්',
          ta: 'சேவைகளைக் கோரவும்'
        },
        description: {
          en: 'Need laborers or drivers? Request them easily from here.',
          si: 'කම්කරුවන් හෝ රියදුරන් අවශ්‍යද? මෙතනින් පහසුවෙන් ඉල්ලා ගන්න.',
          ta: 'தொழிலாளர்கள் அல்லது ஓட்டுநர்கள் தேவையா? இங்கிருந்து எளிதாக கோரவும்.'
        },
        targetElement: 'services-section',
        position: 'center',
        showFor: 4000
      }
    ],
    market: [
      {
        id: 'select-district',
        title: {
          en: 'Select Your District',
          si: 'ඔබගේ දිස්ත්‍රික්කය තෝරන්න',
          ta: 'உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்'
        },
        description: {
          en: 'Choose your district to see local market prices.',
          si: 'ප්‍රාදේශීය වෙළඳපොළ මිල දැකීමට ඔබගේ දිස්ත්‍රික්කය තෝරන්න.',
          ta: 'உள்ளூர் சந்தை விலைகளைப் பார்க்க உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.'
        },
        targetElement: 'district-dropdown',
        position: 'bottom',
        showFor: 3000
      },
      {
        id: 'paddy-type',
        title: {
          en: 'Choose Paddy Type',
          si: 'වී වර්ගය තෝරන්න',
          ta: 'நெல் வகையைத் தேர்ந்தெடுக்கவும்'
        },
        description: {
          en: 'Select the type of paddy you want to check prices for.',
          si: 'ඔබට මිල පරීක්ෂා කරන්න අවශ්‍ය වී වර්ගය තෝරන්න.',
          ta: 'நீங்கள் விலைகளைச் சரிபார்க்க விரும்பும் நெல் வகையைத் தேர்ந்தெදுக்கवум்.'
        },
        targetElement: 'paddy-dropdown',
        position: 'bottom',
        showFor: 3000
      }
    ]
  },
  labor: {
    dashboard: [
      {
        id: 'find-work',
        title: {
          en: 'Find Work Opportunities',
          si: 'රැකියා අවස්ථා සොයන්න',
          ta: 'வேலை வாய்ப்புகளைக் கண்டறியவும்'
        },
        description: {
          en: 'Browse available agricultural work in your area.',
          si: 'ඔබගේ ප්‍රදේශයේ ඇති කෘෂිකාර්මික රැකියා පිරික්සන්න.',
          ta: 'உங்கள் பகுதியில் கிடைக்கும் விவசாய வேலைகளைப் பார்க்கவும்.'
        },
        targetElement: 'work-opportunities',
        position: 'center',
        showFor: 4000
      }
    ]
  },
  driver: {
    dashboard: [
      {
        id: 'transport-services',
        title: {
          en: 'Offer Transport Services',
          si: 'ප්‍රවාහන සේවා ලබා දෙන්න',
          ta: 'போக்குவரத்து சேவைகளை வழங்கவும்'
        },
        description: {
          en: 'Register your vehicle and start accepting transport requests.',
          si: 'ඔබගේ වාහනය ලියාපදිංචි කර ප්‍රවාහන ඉල්ලීම් පිළිගැනීම ආරම්භ කරන්න.',
          ta: 'உங்கள் வாகனத்தைப் பதிவு செய்து போக்குவரத்து கோரிக்கைகளை ஏற்கத் தொடங்குங்கள்.'
        },
        targetElement: 'transport-registration',
        position: 'center',
        showFor: 4000
      }
    ]
  }
};

/**
 * 🎯 Get Guided Tour for User Role and Screen
 */
router.get('/:userRole/:screenName', (req, res) => {
  try {
    const { userRole, screenName } = req.params;
    const { language = 'en' } = req.query;

    // Validate user role
    if (!tourDefinitions[userRole]) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found for this user role'
      });
    }

    // Get tour steps for the screen
    const tourSteps = tourDefinitions[userRole][screenName];
    if (!tourSteps) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found for this screen'
      });
    }

    // Localize tour steps
    const localizedSteps = tourSteps.map((step, index) => ({
      id: step.id,
      order: index + 1,
      title: step.title[language] || step.title.en,
      description: step.description[language] || step.description.en,
      targetElement: step.targetElement,
      position: step.position,
      showFor: step.showFor,
      isLastStep: index === tourSteps.length - 1
    }));

    res.json({
      success: true,
      data: {
        userRole,
        screenName,
        language,
        totalSteps: localizedSteps.length,
        steps: localizedSteps
      }
    });

  } catch (error) {
    console.error('Tour Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get tour information'
    });
  }
});

/**
 * 📚 Get Available Tours for User Role
 */
router.get('/:userRole', (req, res) => {
  try {
    const { userRole } = req.params;
    const { language = 'en' } = req.query;

    if (!tourDefinitions[userRole]) {
      return res.status(404).json({
        success: false,
        message: 'No tours available for this user role'
      });
    }

    const availableScreens = Object.keys(tourDefinitions[userRole]);
    const tourSummary = availableScreens.map(screen => ({
      screenName: screen,
      stepCount: tourDefinitions[userRole][screen].length,
      firstStep: {
        title: tourDefinitions[userRole][screen][0].title[language] || 
               tourDefinitions[userRole][screen][0].title.en,
        description: tourDefinitions[userRole][screen][0].description[language] || 
                    tourDefinitions[userRole][screen][0].description.en
      }
    }));

    res.json({
      success: true,
      data: {
        userRole,
        language,
        availableScreens: tourSummary
      }
    });

  } catch (error) {
    console.error('Tour List Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get available tours'
    });
  }
});

/**
 * ✅ Mark Tour as Completed
 */
router.post('/complete', (req, res) => {
  try {
    const { userRole, screenName, completedSteps, userId } = req.body;

    // Here you would typically save completion status to database
    // For now, we'll just return success
    
    res.json({
      success: true,
      message: 'Tour completion recorded',
      data: {
        userRole,
        screenName,
        completedSteps,
        completedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Tour Completion Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to record tour completion'
    });
  }
});

module.exports = router;