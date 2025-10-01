'use client'

import { useState, useRef, useEffect } from 'react'

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
  const [airControlActive, setAirControlActive] = useState(false)
  const [gestureStatus, setGestureStatus] = useState('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const handsRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const lastHandYRef = useRef<number | null>(null)
  const gestureDebounceRef = useRef<NodeJS.Timeout | null>(null)

  const selectCategory = (category: string) => {
    setSelectedCategory(category)
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
    setSelectedCategory(null)
  }

  const toggleAirControl = async () => {
    if (!airControlActive) {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          
          // Initialize MediaPipe Hands
          await initializeHandTracking()
          
          setAirControlActive(true)
          setGestureStatus('Air Control Active - Show your hand!')
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        setGestureStatus('Camera access denied')
      }
    } else {
      // Stop camera and hand tracking
      stopAirControl()
    }
  }

  const initializeHandTracking = async () => {
    if (typeof window === 'undefined') return

    try {
      const { Hands } = await import('@mediapipe/hands')
      const { Camera } = await import('@mediapipe/camera_utils')

      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        }
      })

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      })

      hands.onResults(onHandResults)
      handsRef.current = hands

      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await hands.send({ image: videoRef.current })
            }
          },
          width: 640,
          height: 480
        })
        
        camera.start()
        cameraRef.current = camera
      }
    } catch (error) {
      console.error('Error initializing hand tracking:', error)
      setGestureStatus('Hand tracking initialization failed')
    }
  }

  const onHandResults = (results: any) => {
    if (!canvasRef.current || !videoRef.current) return

    const canvasCtx = canvasRef.current.getContext('2d')
    if (!canvasCtx) return

    // Clear canvas
    canvasCtx.save()
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height)

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0]
      
      // Draw hand landmarks
      drawHandLandmarks(canvasCtx, landmarks)
      
      // Detect gestures (vertical swipe)
      detectVerticalSwipe(landmarks)
    } else {
      lastHandYRef.current = null
      setGestureStatus('Air Control Active - Show your hand!')
    }

    canvasCtx.restore()
  }

  const drawHandLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17] // Palm
    ]

    ctx.strokeStyle = '#00FF00'
    ctx.lineWidth = 2
    connections.forEach(([start, end]) => {
      ctx.beginPath()
      ctx.moveTo(landmarks[start].x * canvasRef.current!.width, landmarks[start].y * canvasRef.current!.height)
      ctx.lineTo(landmarks[end].x * canvasRef.current!.width, landmarks[end].y * canvasRef.current!.height)
      ctx.stroke()
    })

    // Draw points
    ctx.fillStyle = '#FF0000'
    landmarks.forEach((landmark: any) => {
      ctx.beginPath()
      ctx.arc(landmark.x * canvasRef.current!.width, landmark.y * canvasRef.current!.height, 5, 0, 2 * Math.PI)
      ctx.fill()
    })
  }

  const detectVerticalSwipe = (landmarks: any[]) => {
    // Use the middle finger tip (landmark 12) or wrist (landmark 0) for tracking
    const wrist = landmarks[0]
    const currentY = wrist.y

    if (lastHandYRef.current !== null) {
      const deltaY = currentY - lastHandYRef.current
      const threshold = 0.05 // Sensitivity threshold

      if (Math.abs(deltaY) > threshold) {
        // Clear previous debounce
        if (gestureDebounceRef.current) {
          clearTimeout(gestureDebounceRef.current)
        }

        // Debounce gesture detection
        gestureDebounceRef.current = setTimeout(() => {
          if (deltaY < -threshold) {
            // Hand moved up -> scroll down (next category)
            handleSwipeDown()
          } else if (deltaY > threshold) {
            // Hand moved down -> scroll up (previous category)
            handleSwipeUp()
          }
        }, 300)
      }
    }

    lastHandYRef.current = currentY
  }

  const handleSwipeUp = () => {
    setGestureStatus('👆 Swipe Up Detected!')
    if (scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollTop
      const containerHeight = scrollContainerRef.current.clientHeight
      scrollContainerRef.current.scrollTo({
        top: currentScroll - containerHeight,
        behavior: 'smooth'
      })
    }
  }

  const handleSwipeDown = () => {
    setGestureStatus('👇 Swipe Down Detected!')
    if (scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollTop
      const containerHeight = scrollContainerRef.current.clientHeight
      scrollContainerRef.current.scrollTo({
        top: currentScroll + containerHeight,
        behavior: 'smooth'
      })
    }
  }

  const stopAirControl = () => {
    // Stop camera
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }

    // Stop camera instance
    if (cameraRef.current) {
      cameraRef.current.stop()
      cameraRef.current = null
    }

    // Close hands
    if (handsRef.current) {
      handsRef.current.close()
      handsRef.current = null
    }

    setAirControlActive(false)
    setGestureStatus('')
    lastHandYRef.current = null
  }

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopAirControl()
    }
  }, [])

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Control Buttons */}
      <div className="flex justify-center items-center gap-3 py-3 md:py-4 bg-gray-100 border-b-2 border-gray-300">
        <button
          onClick={toggleFlip}
          className="px-4 md:px-6 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm md:text-base font-semibold rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          {isFlipped ? 'Show Products' : 'Show Categories'}
        </button>

        <button
          onClick={toggleAirControl}
          className={`px-4 md:px-6 py-2 md:py-3 ${
            airControlActive 
              ? 'bg-green-500 hover:bg-green-600 active:bg-green-700' 
              : 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700'
          } text-white text-sm md:text-base font-semibold rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2`}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          {airControlActive ? 'Stop Air Control' : 'Air Control'}
        </button>
      </div>

      {/* Gesture Status */}
      {airControlActive && (
        <div className="bg-green-100 text-green-800 py-2 px-4 text-center text-sm md:text-base font-semibold">
          {gestureStatus}
        </div>
      )}

      {/* Camera Feed (hidden but active) */}
      {airControlActive && (
        <div className="fixed bottom-4 right-4 z-50 border-4 border-green-500 rounded-lg overflow-hidden shadow-2xl">
          <div className="relative">
            <video
              ref={videoRef}
              className="hidden"
              width="640"
              height="480"
            />
            <canvas
              ref={canvasRef}
              className="block"
              width="320"
              height="240"
            />
          </div>
        </div>
      )}

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
          <div 
            ref={scrollContainerRef}
            className="snap-y snap-mandatory overflow-y-auto overflow-x-hidden h-full scrollbar-thin"
          >
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
