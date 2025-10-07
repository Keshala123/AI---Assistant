const express = require('express');
const router = express.Router();

/**
 * 📊 Agricultural Knowledge Base Routes
 * Provides access to farming data, market prices, cultivation tips
 */

// Sample agricultural knowledge data
const knowledgeBase = {
  // Market prices for different paddy types
  marketPrices: {
    'colombo': {
      'samba': { dry: 120, wet: 130 },
      'naadu-red': { dry: 110, wet: 115 },
      'naadu-white': { dry: 115, wet: 120 },
      'keeri-samba': { dry: 125, wet: 135 }
    },
    'kandy': {
      'samba': { dry: 118, wet: 128 },
      'naadu-red': { dry: 108, wet: 113 },
      'naadu-white': { dry: 113, wet: 118 },
      'keeri-samba': { dry: 123, wet: 133 }
    }
    // Add more districts...
  },

  // Cultivation calendar
  cultivationCalendar: {
    'maha': {
      season: 'October - March',
      planting: 'October - December',
      harvesting: 'February - March',
      varieties: ['samba', 'naadu-red', 'keeri-samba']
    },
    'yala': {
      season: 'April - September',
      planting: 'April - June',
      harvesting: 'August - September',
      varieties: ['naadu-white', 'samba']
    }
  },

  // Common problems and solutions
  problems: {
    'yellow-leaves': {
      causes: ['nitrogen-deficiency', 'overwatering', 'pest-attack'],
      solutions: ['apply-urea-fertilizer', 'improve-drainage', 'pest-control'],
      severity: 'medium'
    },
    'brown-spots': {
      causes: ['fungal-disease', 'blast-disease'],
      solutions: ['apply-fungicide', 'remove-affected-plants'],
      severity: 'high'
    }
  }
};

/**
 * 💰 Get Market Prices
 */
router.get('/market-prices', (req, res) => {
  const { district, variety, moisture } = req.query;
  
  try {
    if (district && variety) {
      const districtPrices = knowledgeBase.marketPrices[district.toLowerCase()];
      if (districtPrices && districtPrices[variety.toLowerCase()]) {
        const price = moisture ? 
          districtPrices[variety.toLowerCase()][moisture.toLowerCase()] :
          districtPrices[variety.toLowerCase()];
        
        return res.json({
          success: true,
          data: {
            district,
            variety,
            moisture,
            price,
            currency: 'LKR',
            unit: 'per kg',
            lastUpdated: new Date().toISOString()
          }
        });
      }
    }

    // Return all market prices if no specific query
    res.json({
      success: true,
      data: knowledgeBase.marketPrices
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market prices'
    });
  }
});

/**
 * 🌾 Get Cultivation Information
 */
router.get('/cultivation', (req, res) => {
  const { season, month } = req.query;
  
  try {
    if (season) {
      const seasonInfo = knowledgeBase.cultivationCalendar[season.toLowerCase()];
      if (seasonInfo) {
        return res.json({
          success: true,
          data: seasonInfo
        });
      }
    }

    res.json({
      success: true,
      data: knowledgeBase.cultivationCalendar
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cultivation information'
    });
  }
});

/**
 * 🔧 Get Problem Solutions
 */
router.get('/problems', (req, res) => {
  const { issue } = req.query;
  
  try {
    if (issue) {
      const problemInfo = knowledgeBase.problems[issue.toLowerCase()];
      if (problemInfo) {
        return res.json({
          success: true,
          data: problemInfo
        });
      }
    }

    res.json({
      success: true,
      data: knowledgeBase.problems
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problem solutions'
    });
  }
});

/**
 * 🔍 Search Knowledge Base
 */
router.get('/search', (req, res) => {
  const { query, category } = req.query;
  
  try {
    // Simple search implementation
    const results = [];
    
    // Search in market prices
    if (!category || category === 'market') {
      Object.keys(knowledgeBase.marketPrices).forEach(district => {
        if (district.includes(query?.toLowerCase() || '')) {
          results.push({
            type: 'market',
            title: `Market prices in ${district}`,
            data: knowledgeBase.marketPrices[district]
          });
        }
      });
    }

    // Search in cultivation calendar
    if (!category || category === 'cultivation') {
      Object.keys(knowledgeBase.cultivationCalendar).forEach(season => {
        const seasonData = knowledgeBase.cultivationCalendar[season];
        if (season.includes(query?.toLowerCase() || '') || 
            seasonData.varieties.some(v => v.includes(query?.toLowerCase() || ''))) {
          results.push({
            type: 'cultivation',
            title: `${season} season cultivation`,
            data: seasonData
          });
        }
      });
    }

    res.json({
      success: true,
      data: results,
      query,
      resultCount: results.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

module.exports = router;