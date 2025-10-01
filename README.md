# Scripe Store - Modern Shopping App

A Next.js store application with smooth scrolling and category browsing.

## 🌟 Features

- **12 Product Categories** with subcategories
- **Vertical Scrolling** - Snap scroll through categories
- **Horizontal Subcategory Scroll** - Swipe through items
- **Category Grid View** - See all categories at once
- **Fully Responsive** - Works on mobile and desktop
- **Modern UI** - Beautiful gradient design with Tailwind CSS

## 🚀 Live Demo

Deploy to Vercel: **https://scripe.vercel.app**

## 📦 Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## 🛠️ Local Development

```bash
# Clone repository
git clone https://github.com/Saicrypto/scripe.git
cd scripe

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

## 📱 Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Saicrypto/scripe)

### Option 2: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import from GitHub: `Saicrypto/scripe`
4. Click "Deploy"
5. Done! Your app will be live at `https://scripe.vercel.app`

### Option 3: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🌐 Environment

### Production URLs
- **Primary:** `https://scripe.vercel.app`
- **Auto-generated:** `https://scripe-[hash].vercel.app`

### Features on Vercel
- ✅ Automatic HTTPS/SSL
- ✅ Camera API enabled
- ✅ Global CDN
- ✅ Auto-deploy on push
- ✅ Preview deployments
- ✅ Zero configuration

## 📂 Project Structure

```
scripe/
├── app/
│   ├── page.tsx          # Main application
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── public/               # Static assets
├── package.json          # Dependencies
├── vercel.json           # Vercel config
├── tailwind.config.js    # Tailwind config
├── tsconfig.json         # TypeScript config
└── README.md            # This file
```

## 🎨 Categories

1. Dairy & Eggs
2. Fruits & Vegetables
3. Bakery
4. Meat & Seafood
5. Frozen Foods
6. Beverages
7. Snacks & Sweets
8. Cereals & Breakfast
9. Pasta & Rice
10. Canned Goods
11. Spices & Condiments
12. Household & Cleaning

## 🔧 Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## 📄 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### Build Fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`

### Scrolling Issues
- Clear browser cache
- Check if using a modern browser
- Ensure JavaScript is enabled

## 📊 Performance

- **First Load:** < 3s on 3G
- **Lighthouse Score:** 90+
- **Mobile Optimized:** Responsive design
- **Smooth Scrolling:** 60 FPS animations

## 🤝 Contributing

Pull requests welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - feel free to use for your projects!

## 👨‍💻 Author

- GitHub: [@Saicrypto](https://github.com/Saicrypto)
- Repository: [scripe](https://github.com/Saicrypto/scripe)

## 🙏 Acknowledgments

- **Vercel** - Hosting and deployment
- **Next.js** - React framework
- **Tailwind CSS** - Styling framework

---

**Ready to deploy?** Just push to GitHub or run `vercel`! 🚀
