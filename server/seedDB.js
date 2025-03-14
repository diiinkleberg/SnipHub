const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const User = require('./models/User');
const Snippet = require('./models/Snippet');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/SnipHub')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Programming languages for snippets
const languages = [
  'javascript',
  'python',
  'java',
  'typescript',
  'csharp',
  'php',
  'ruby',
  'go',
  'rust',
  'kotlin',
];

// Generate code snippets based on language
// Generate code snippets based on language
const generateCode = (language) => {
  const functionName = faker.word.sample() + faker.string.alphanumeric(3);
  const param1 = faker.word.sample().toLowerCase();
  const param2 = faker.word.sample().toLowerCase();
  const variable = faker.word.sample().toLowerCase();
  const className = faker.word.adjective() + faker.word.noun();
  const commentText = faker.lorem.sentence();

  const codeTemplates = {
    // JavaScript Template with ES6 features
    javascript: `/**
 * ${commentText}
 * @param {Object} ${param1} - The input parameter
 * @param {number} [${param2}=10] - Optional parameter with default
 * @returns {Promise<Object>} Result of the operation
 */
async function ${functionName}(${param1}, ${param2} = 10) {
  try {
    const ${variable} = await fetchData(${param1}.id);
    
    // Process the results
    const results = ${variable}.items.map(item => ({
      id: item.id,
      name: item.name.toUpperCase(),
      value: item.value * ${param2}
    }));
    
    return {
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(\`Error processing ${param1}: \${error.message}\`);
    return { success: false, error: error.message };
  }
}`,

    // Python Template with modern Python features
    python: `import json
import logging
from datetime import datetime
from typing import Dict, List, Optional

# ${commentText}
def ${functionName}(${param1}: Dict, ${param2}: int = 10) -> Dict:
    """
    Process the input data and return formatted results.
    
    Args:
        ${param1}: Input data dictionary
        ${param2}: Multiplier value, defaults to 10
        
    Returns:
        Dictionary containing processed results
    """
    try:
        # Fetch related data
        ${variable} = get_data(${param1}["id"])
        
        # Process the results
        results = [
            {
                "id": item["id"],
                "name": item["name"].upper(),
                "value": item["value"] * ${param2}
            }
            for item in ${variable}["items"]
        ]
        
        return {
            "success": True,
            "data": results,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logging.error(f"Error processing {${param1}}: {str(e)}")
        return {"success": False, "error": str(e)}`,

    // TypeScript Template
    typescript: `/**
 * ${commentText}
 * @param ${param1} - The input parameter
 * @param ${param2} - Optional parameter with default
 */
interface ResultItem {
  id: string;
  name: string;
  value: number;
}

interface Result {
  success: boolean;
  data?: ResultItem[];
  error?: string;
  timestamp: string;
}

async function ${functionName}(
  ${param1}: { id: string; items?: any[] }, 
  ${param2}: number = 10
): Promise<Result> {
  try {
    const ${variable} = await fetchData<any>(${param1}.id);
    
    // Process the results
    const results: ResultItem[] = ${variable}.items.map((item: any) => ({
      id: item.id,
      name: item.name.toUpperCase(),
      value: item.value * ${param2}
    }));
    
    return {
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(\`Error processing ${param1}: \${error instanceof Error ? error.message : String(error)}\`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    };
  }
}`,

    // Java Template
    java: `import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Logger;
import java.util.logging.Level;

/**
 * ${commentText}
 */
public class ${className} {
    private static final Logger logger = Logger.getLogger(${className}.class.getName());

    /**
     * Process the input data and return formatted results.
     *
     * @param ${param1} The input parameter
     * @param ${param2} Multiplier value, defaults to 10
     * @return Result containing processed data
     */
    public Result ${functionName}(InputData ${param1}, int ${param2}) {
        try {
            DataService service = new DataService();
            ResponseData ${variable} = service.fetchData(${param1}.getId());
            
            List<ResultItem> results = new ArrayList<>();
            
            for (Item item : ${variable}.getItems()) {
                ResultItem resultItem = new ResultItem();
                resultItem.setId(item.getId());
                resultItem.setName(item.getName().toUpperCase());
                resultItem.setValue(item.getValue() * ${param2});
                results.add(resultItem);
            }
            
            Result result = new Result();
            result.setSuccess(true);
            result.setData(results);
            result.setTimestamp(new Date());
            
            return result;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error processing " + ${param1}.getId(), e);
            
            Result errorResult = new Result();
            errorResult.setSuccess(false);
            errorResult.setError(e.getMessage());
            errorResult.setTimestamp(new Date());
            
            return errorResult;
        }
    }
}`,

    // C# Template
    csharp: `using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ${className}Namespace
{
    /// <summary>
    /// ${commentText}
    /// </summary>
    public class ${className}
    {
        private readonly ILogger<${className}> _logger;
        private readonly IDataService _dataService;

        public ${className}(ILogger<${className}> logger, IDataService dataService)
        {
            _logger = logger;
            _dataService = dataService;
        }

        /// <summary>
        /// Process the input data and return formatted results.
        /// </summary>
        /// <param name="${param1}">The input parameter</param>
        /// <param name="${param2}">Multiplier value, defaults to 10</param>
        /// <returns>Result containing processed data</returns>
        public async Task<Result> ${functionName}Async(InputData ${param1}, int ${param2} = 10)
        {
            try
            {
                var ${variable} = await _dataService.GetDataAsync(${param1}.Id);
                
                var results = ${variable}.Items.Select(item => new ResultItem
                {
                    Id = item.Id,
                    Name = item.Name.ToUpper(),
                    Value = item.Value * ${param2}
                }).ToList();
                
                return new Result
                {
                    Success = true,
                    Data = results,
                    Timestamp = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error processing {${param1}.Id}");
                
                return new Result
                {
                    Success = false,
                    Error = ex.Message,
                    Timestamp = DateTime.UtcNow
                };
            }
        }
    }
}`,

    // Go Template
    go: `package ${functionName.toLowerCase()}

import (
    "encoding/json"
    "fmt"
    "log"
    "time"
)

// ${commentText}

// ResultItem represents a processed item
type ResultItem struct {
    ID    string  \`json:"id"\`
    Name  string  \`json:"name"\`
    Value float64 \`json:"value"\`
}

// Result represents the operation result
type Result struct {
    Success   bool        \`json:"success"\`
    Data      []ResultItem \`json:"data,omitempty"\`
    Error     string      \`json:"error,omitempty"\`
    Timestamp time.Time   \`json:"timestamp"\`
}

// ${functionName} processes input data and returns formatted results
func ${functionName}(${param1} map[string]interface{}, ${param2} int) (Result, error) {
    result := Result{
        Timestamp: time.Now(),
    }

    // Fetch related data
    ${variable}, err := fetchData(${param1}["id"].(string))
    if err != nil {
        log.Printf("Error fetching data: %v", err)
        result.Success = false
        result.Error = err.Error()
        return result, err
    }

    // Process the results
    items := ${variable}["items"].([]interface{})
    results := make([]ResultItem, 0, len(items))

    for _, item := range items {
        itemMap := item.(map[string]interface{})
        resultItem := ResultItem{
            ID:    itemMap["id"].(string),
            Name:  fmt.Sprintf("%s", itemMap["name"]),
            Value: itemMap["value"].(float64) * float64(${param2}),
        }
        results = append(results, resultItem)
    }

    result.Success = true
    result.Data = results

    return result, nil
}`,
  };

  // Try to get template for specified language, fall back to JavaScript
  return codeTemplates[language] || codeTemplates.javascript;
};

// Create and seed database
async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Snippet.deleteMany({});
    console.log('Cleared existing data');

    const defaultPassword = await bcrypt.hash('password123', 10);

    // Create users with faker
    const users = await User.insertMany([
      {
        username: 'admin',
        email: 'admin@example.com',
        password: defaultPassword,
        favorites: [],
      },
      ...Array.from({ length: 49 }, () => ({
        username: faker.internet.userName().toLowerCase(),
        email: faker.internet.email(),
        password: defaultPassword,
        favorites: [],
      })),
    ]);
    console.log(`Created ${users.length} users`);

    // Create snippets with faker
    const snippets = await Snippet.insertMany(
      Array.from({ length: 1500 }, () => {
        const language = faker.helpers.arrayElement(languages);
        return {
          title: `${faker.hacker.ingverb()} ${faker.hacker.adjective()} ${language} ${faker.hacker.noun()}`,
          code: generateCode(language),
          programmingLanguage: language,
          description: faker.lorem.paragraph(),
          user: faker.helpers.arrayElement(users)._id,
        };
      })
    );
    console.log(`Created ${snippets.length} snippets`);

    // Add random favorites
    const updatePromises = users.map((user) => {
      const favoriteIds = faker.helpers
        .arrayElements(snippets, faker.number.int({ min: 0, max: 10 }))
        .map((snippet) => snippet._id);

      return User.findByIdAndUpdate(user._id, {
        $set: { favorites: favoriteIds },
      });
    });

    await Promise.all(updatePromises);
    console.log('Added random favorites for users');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
