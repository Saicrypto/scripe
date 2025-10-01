'use client'

import { useState } from 'react'

export default function Home() {
  const categoriesWithSubs = [
    {
      name: 'Dairy & Eggs',
      subcategories: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Eggs', 'Cream']
    },
    {
      name: 'Fruits & Vegetables',
      subcategories: ['Fresh Fruits', 'Fresh Vegetables', 'Salads', 'Herbs', 'Organic', 'Exotic']
    },
    {
      name: 'Bakery',
      subcategories: ['Bread', 'Pastries', 'Cakes', 'Cookies', 'Donuts', 'Bagels']
    },
    {
      name: 'Meat & Seafood',
      subcategories: ['Chicken', 'Beef', 'Pork', 'Fish', 'Shrimp', 'Lobster']
    },
    {
      name: 'Frozen Foods',
      subcategories: ['Ice Cream', 'Frozen Meals', 'Frozen Vegetables', 'Pizza', 'Desserts', 'Appetizers']
    },
    {
      name: 'Beverages',
      subcategories: ['Water', 'Juice', 'Soda', 'Coffee', 'Tea', 'Energy Drinks']
    },
    {
      name: 'Snacks & Sweets',
      subcategories: ['Chips', 'Candy', 'Chocolate', 'Nuts', 'Popcorn', 'Crackers']
    },
    {
      name: 'Cereals & Breakfast',
      subcategories: ['Cereal', 'Oatmeal', 'Granola', 'Pancake Mix', 'Syrup', 'Breakfast Bars']
    },
    {
      name: 'Pasta & Rice',
      subcategories: ['Pasta', 'Rice', 'Noodles', 'Couscous', 'Quinoa', 'Sauces']
    },
    {
      name: 'Canned Goods',
      subcategories: ['Soups', 'Beans', 'Tomatoes', 'Vegetables', 'Fruits', 'Tuna']
    },
    {
      name: 'Spices & Condiments',
      subcategories: ['Salt & Pepper', 'Herbs', 'Sauces', 'Oil & Vinegar', 'Ketchup & Mustard', 'Hot Sauce']
    },
    {
      name: 'Household & Cleaning',
      subcategories: ['Detergent', 'Paper Products', 'Trash Bags', 'Cleaning Supplies', 'Air Fresheners', 'Dish Soap']
    }
  ]

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  const selectCategory = (category: string) => {
    setSelectedCategory(category)
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
    setSelectedCategory(null)
  }

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Flip Button */}
      <div className="flex justify-center items-center py-3 md:py-4 bg-gray-100 border-b-2 border-gray-300">
        <button
          onClick={toggleFlip}
          className="px-4 md:px-6 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm md:text-base font-semibold rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          {isFlipped ? 'Show Products' : 'Show Categories'}
        </button>
      </div>

      {/* Main Content - Single Section */}
      <div className="w-full flex-1 overflow-hidden flex flex-col">
        {selectedCategory && !isFlipped && (
          <div className="bg-blue-500 text-white py-2 md:py-3 px-4 md:px-6 text-center w-full z-10 flex-shrink-0">
            <h2 className="text-base md:text-lg font-semibold">{selectedCategory}</h2>
          </div>
        )}
        
        {/* Conditional Scrollable Container */}
        {selectedCategory ? (
          // Horizontal scrolling for selected category's subcategories - Full screen
          <div className="snap-x snap-mandatory overflow-x-auto overflow-y-hidden flex-1 scrollbar-thin flex bg-gradient-to-br from-blue-50 to-blue-100">
            {categoriesWithSubs.find(c => c.name === selectedCategory)?.subcategories.map((sub) => (
              <div
                key={sub}
                className="snap-start min-w-full h-full flex-shrink-0 flex flex-col items-center justify-center p-4 md:p-8"
              >
                <div className="w-full max-w-4xl h-full flex items-center justify-center">
                  <div className="bg-white p-8 md:p-16 rounded-2xl shadow-2xl border-4 border-blue-400 hover:border-blue-600 active:border-blue-700 transition-all w-full">
                    <p className="font-bold text-3xl md:text-5xl lg:text-6xl text-gray-800 text-center">{sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isFlipped ? (
          // Show all 12 category names at once in a grid
          <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 overflow-y-auto">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-4 md:mb-6">All Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
              {categoriesWithSubs.map((category) => (
                <div
                  key={category.name}
                  onClick={() => selectCategory(category.name)}
                  className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-xl active:shadow-2xl transition-all cursor-pointer border-2 border-blue-300 hover:border-blue-500 active:border-blue-600"
                >
                  <p className="font-bold text-sm md:text-base text-gray-800 text-center">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Vertical scrolling with all 12 categories
          <div className="snap-y snap-mandatory overflow-y-auto overflow-x-hidden h-full scrollbar-thin">
            {categoriesWithSubs.map((category) => (
              <div
                key={category.name}
                className="snap-start h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center border-b-4 border-blue-200 p-4 md:p-8"
              >
                <h4 className="font-bold text-2xl md:text-4xl text-gray-800 text-center mb-4 md:mb-8">{category.name}</h4>
                {/* Subcategories horizontal snap scroll */}
                <div className="w-full max-w-4xl snap-x snap-mandatory overflow-x-auto scrollbar-thin flex">
                  {category.subcategories.map((sub) => (
                    <div
                      key={sub}
                      className="snap-start min-w-full flex-shrink-0 px-4"
                    >
                      <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg border-2 border-blue-300 hover:border-blue-500 active:border-blue-600 transition-all">
                        <p className="font-bold text-lg md:text-2xl text-gray-800 text-center">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-in;
        }
      `}</style>
    </div>
  )
}
