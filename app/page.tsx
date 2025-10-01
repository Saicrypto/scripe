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
        console.log('Starting air control...')
        setGestureStatus('Requesting camera access...')
        
        // Request camera access - Mobile-friendly settings
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640, max: 1280 },
            height: { ideal: 480, max: 720 },
            aspectRatio: 4/3
          },
          audio: false
        })
        
        console.log('Camera access granted')
        setGestureStatus('Camera access granted, initializing...')
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          
          console.log('Video playing')
          setGestureStatus('Video playing, loading hand tracking...')
          
          // Initialize MediaPipe Hands
          await initializeHandTracking()
          
          setAirControlActive(true)
          setGestureStatus('Air Control Active - Show your hand!')
          console.log('Air control fully activated')
        }
      } catch (error: any) {
        console.error('Error accessing camera:', error)
        setGestureStatus(`Error: ${error.message || 'Camera access denied'}`)
        
        let errorMessage = 'Air Control Error: '
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Camera permission denied. Please allow camera access in your browser settings.'
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera found. Please check your device has a camera.'
        } else if (error.name === 'NotReadableError') {
          errorMessage += 'Camera is already in use by another app.'
        } else {
          errorMessage += error.message || 'Camera access failed. On mobile, ensure you\'re using HTTPS or localhost.'
        }
        
        alert(errorMessage)
      }
    } else {
      // Stop camera and hand tracking
      stopAirControl()
    }
  }

  const initializeHandTracking = async () => {
    if (typeof window === 'undefined') {
      console.log('Window is undefined, skipping hand tracking')
      return
    }

    try {
      console.log('Loading MediaPipe Hands library...')
      const { Hands } = await import('@mediapipe/hands')
      const { Camera } = await import('@mediapipe/camera_utils')
      console.log('MediaPipe libraries loaded successfully')

      console.log('Creating Hands instance...')
      const hands = new Hands({
        locateFile: (file) => {
          const url = `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
          console.log('Loading file:', url)
          return url
        }
      })

      console.log('Setting Hands options...')
      // Use lighter settings for mobile performance
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: isMobile ? 0 : 1, // Lighter model for mobile
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      })
      console.log('Mobile device:', isMobile)

      console.log('Setting onResults callback...')
      hands.onResults(onHandResults)
      handsRef.current = hands

      if (videoRef.current) {
        console.log('Creating Camera instance...')
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && handsRef.current) {
              await handsRef.current.send({ image: videoRef.current })
            }
          },
          width: 640,
          height: 480
        })
        
        console.log('Starting camera...')
        camera.start()
        cameraRef.current = camera
        console.log('Hand tracking fully initialized')
      }
    } catch (error: any) {
      console.error('Error initializing hand tracking:', error)
      console.error('Error details:', error.message, error.stack)
      setGestureStatus(`Hand tracking failed: ${error.message}`)
      alert(`Hand tracking initialization failed: ${error.message}`)
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
      
      // Show hand detected status
      if (gestureStatus === 'Air Control Active - Show your hand!') {
        setGestureStatus('Hand detected! Move up/down to scroll')
      }
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

      console.log('Hand Y:', currentY.toFixed(3), 'Delta:', deltaY.toFixed(3))

      if (Math.abs(deltaY) > threshold) {
        console.log('Gesture detected! Delta:', deltaY)
        
        // Clear previous debounce
        if (gestureDebounceRef.current) {
          clearTimeout(gestureDebounceRef.current)
        }

        // Debounce gesture detection
        gestureDebounceRef.current = setTimeout(() => {
          if (deltaY < -threshold) {
            // Hand moved up -> scroll down (next category)
            console.log('Swipe DOWN gesture')
            handleSwipeDown()
          } else if (deltaY > threshold) {
            // Hand moved down -> scroll up (previous category)
            console.log('Swipe UP gesture')
            handleSwipeUp()
          }
        }, 300)
      }
    }

    lastHandYRef.current = currentY
  }

  const handleSwipeUp = () => {
    console.log('handleSwipeUp called')
    setGestureStatus('👆 Swipe Up Detected!')
    if (scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollTop
      const containerHeight = scrollContainerRef.current.clientHeight
      console.log('Scrolling up from', currentScroll, 'by', containerHeight)
      scrollContainerRef.current.scrollTo({
        top: currentScroll - containerHeight,
        behavior: 'smooth'
      })
    } else {
      console.log('scrollContainerRef is null')
    }
  }

  const handleSwipeDown = () => {
    console.log('handleSwipeDown called')
    setGestureStatus('👇 Swipe Down Detected!')
    if (scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollTop
      const containerHeight = scrollContainerRef.current.clientHeight
      console.log('Scrolling down from', currentScroll, 'by', containerHeight)
      scrollContainerRef.current.scrollTo({
        top: currentScroll + containerHeight,
        behavior: 'smooth'
      })
    } else {
      console.log('scrollContainerRef is null')
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
        <div className="bg-green-100 text-green-800 py-2 px-2 md:px-4 text-center text-xs md:text-sm font-semibold">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{gestureStatus}</span>
          </div>
        </div>
      )}

      {/* HTTPS Warning for production */}
      {typeof window !== 'undefined' && window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && (
        <div className="bg-yellow-100 text-yellow-800 py-2 px-4 text-center text-xs md:text-sm">
          ⚠️ Camera requires HTTPS in production. Air Control may not work.
        </div>
      )}

      {/* Camera Feed - Responsive for mobile */}
      {airControlActive && (
        <div className="fixed bottom-2 right-2 md:bottom-4 md:right-4 z-50 border-2 md:border-4 border-green-500 rounded-lg overflow-hidden shadow-2xl">
          <div className="relative">
            <video
              ref={videoRef}
              className="hidden"
              width="640"
              height="480"
            />
            <canvas
              ref={canvasRef}
              className="block w-32 h-24 md:w-80 md:h-60"
              width="320"
              height="240"
            />
            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
              LIVE
            </div>
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
