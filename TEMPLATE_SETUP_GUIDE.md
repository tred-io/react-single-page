# Business Website Template Setup Guide

This template provides a complete business website solution with content management, SEO optimization, and secure admin access. Perfect for feed stores, restaurants, retail shops, service businesses, and more!

## 🚀 Quick Start (5 Minutes)

### Step 1: Change Your Admin Password
1. Open `client/src/hooks/useAuth.ts`
2. Find line 15: `const ADMIN_PASSWORD = "brownfeed2024";`
3. Change to your secure password: `const ADMIN_PASSWORD = "your-new-password";`

### Step 2: Update Business Information
1. Start the application: `npm run dev`
2. Go to `/admin` in your browser
3. Login with your new password
4. Update all store information:
   - Business name and tagline
   - Address, phone, email
   - Hours of operation
   - About section and story
   - Founded year

### Step 3: Customize Product/Service Categories
1. In the admin panel, go to "Product Categories" tab
2. Edit existing categories or create new ones:
   - **Feed Store**: Livestock Feed, Pet Supplies, Equipment
   - **Restaurant**: Appetizers, Main Courses, Desserts
   - **Service Business**: Consulting, Installation, Maintenance
   - **Retail Store**: Clothing, Electronics, Home Goods

### Step 4: Generate SEO-Optimized Site
Run this command to create search engine optimized pages:
```bash
tsx build-static.ts
```

## 🎨 Design Customization

### Color Scheme
Edit `client/src/index.css` to change the color palette:

```css
:root {
  /* Current agricultural theme */
  --saddle-brown: #8B4513;
  --warm-beige: #F5E6D3;
  --chocolate-orange: #CD853F;
  
  /* Restaurant theme example */
  --primary: #8B0000;      /* Deep red */
  --secondary: #FFF8DC;    /* Cream */
  --accent: #CD853F;       /* Gold */
  
  /* Professional services example */
  --primary: #1E3A8A;      /* Navy blue */
  --secondary: #F8FAFC;    /* Light gray */
  --accent: #3B82F6;       /* Blue */
}
```

### Logo & Favicon Upload
✅ **Already Built-In!**
1. Go to admin panel → Store Settings tab
2. Upload your business logo (displays in navigation)
3. Upload favicon (appears in browser tab)
4. Supports JPG, PNG, SVG formats up to 5MB

## 📱 Business Type Templates

### Restaurant/Cafe Setup
```
Categories:
- Appetizers & Starters
- Main Courses
- Desserts & Beverages
- Daily Specials

About Story: "Family recipes passed down through generations..."
Color Scheme: Warm reds and creams
```

### Service Business Setup
```
Categories:
- Consultation Services
- Installation & Setup
- Maintenance & Repair
- Emergency Services

About Story: "Professional expertise you can trust..."
Color Scheme: Professional blues and grays
```

### Retail Store Setup
```
Categories:
- Featured Products
- New Arrivals
- Sale Items
- Gift Ideas

About Story: "Quality products for your lifestyle..."
Color Scheme: Modern and vibrant
```

## 🔧 Technical Customization

### Database Setup (Optional)
Current template uses in-memory storage. To add database:
1. Uncomment database configuration in `drizzle.config.ts`
2. Update `server/storage.ts` to use DatabaseStorage
3. Run: `npm run db:push`

### Domain and Hosting
1. Update the domain in `build-static.ts` (line 26)
2. Configure your hosting provider
3. Set up SSL certificate
4. Run `npm run build:seo` for production

### SEO Customization
Edit `build-static.ts` to customize:
- Meta descriptions
- Keywords for your industry
- Schema markup
- Social media previews

## 📋 Content Planning Worksheet

Before setup, gather this information:

**Business Details:**
- [ ] Business name and tagline
- [ ] Complete address
- [ ] Phone number and email
- [ ] Operating hours (Mon-Sun)
- [ ] Year established

**About Section:**
- [ ] Brief description (1-2 sentences)
- [ ] Detailed story (2-3 paragraphs)
- [ ] What makes you unique

**Categories/Services:**
- [ ] Category 1: Name, description, items/services
- [ ] Category 2: Name, description, items/services  
- [ ] Category 3: Name, description, items/services
- [ ] Category 4: Name, description, items/services

**SEO Keywords:**
- [ ] Primary business keywords
- [ ] Location-based keywords
- [ ] Service/product keywords

## 🚀 Deployment Checklist

- [ ] Updated admin password
- [ ] Completed all business information
- [ ] Customized categories/services
- [ ] Updated color scheme (if desired)
- [ ] Generated static pages: `tsx build-static.ts`
- [ ] Built production version: `npm run build`
- [ ] Tested admin panel functionality
- [ ] Verified SEO meta tags
- [ ] Set up hosting and domain
- [ ] SSL certificate configured

## 📄 Custom Pages Feature

### Built-In Page Management
✅ **Create unlimited custom pages:**
- **Service Pages**: "Our Services", "Pricing", "Consultation"
- **Info Pages**: "FAQ", "Privacy Policy", "Terms of Service"
- **Marketing Pages**: "Special Offers", "Testimonials", "Gallery"

### How to Add Custom Pages:
1. **Admin Panel** → "Custom Pages" tab
2. **Create Page**: Title, URL slug, content
3. **Navigation**: Choose if page appears in menu
4. **Content**: Full rich text editing
5. **Publishing**: Draft or published status

### Example Use Cases:

**Restaurant Template:**
- Menu page with full descriptions
- Catering services page
- Private events page
- Wine list page

**Service Business Template:**
- Individual service detail pages
- Pricing and packages page
- FAQ page
- Client testimonials page

**Retail Store Template:**
- Brand story page
- Shipping and returns page
- Size guide page
- Care instructions page

## 💡 Advanced Features (Optional)

### Contact Form Integration
Add contact functionality with email service

### Blog/News Section
Add content marketing capabilities

### E-commerce Integration
Add online ordering and payment processing

### Analytics Integration
Track website performance and conversions

## 🆘 Common Issues

**Admin button not showing:** Make sure you're logged in with correct password

**SEO not working:** Run `tsx build-static.ts` after content changes

**Styling issues:** Check CSS custom properties are properly defined

**Database errors:** Verify database URL is configured correctly

## 📞 Support

This template includes:
- ✅ Content management system
- ✅ SEO optimization
- ✅ Responsive design
- ✅ Security features
- ✅ Professional styling

Perfect for any business wanting a professional web presence with easy content management!