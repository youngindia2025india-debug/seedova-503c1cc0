# Hope Journey

# Seedova — Prompt 1 (Project Foundation)



You are a principal software architect, senior UI/UX designer, senior frontend engineer, senior backend engineer, database architect, QA engineer, and DevOps engineer.



Build the foundation of a production-ready web application called **Seedova**.



IMPORTANT RULES



• This is Prompt 1 of a multi-prompt project.

• Build incrementally.

• NEVER rewrite existing code unless required for compatibility.

• NEVER delete existing components.

• NEVER regenerate previously completed pages.

• Preserve architecture throughout future prompts.

• Every component must be production-ready.

• No placeholder buttons.

• No broken links.

• No dummy pages.

• No runtime errors.

• No TypeScript errors.



------------------------------------------------



PROJECT



Seedova is India's trusted IVF clinic discovery and anonymous patient community.



It helps users



• Discover IVF clinics

• Compare clinics

• Read anonymous experiences

• Ask anonymous questions

• Track IVF journeys



This is NOT



• Hospital Management System

• Clinic ERP

• Appointment Software



------------------------------------------------



TECH STACK



Frontend



• React

• TypeScript

• Vite

• Tailwind CSS

• React Router

• TanStack Query

• React Hook Form

• Zod

• Framer Motion



Backend



Use Supabase.



Use



• PostgreSQL

• Supabase Authentication

• Supabase Storage

• Row Level Security



Do NOT use Firebase.



------------------------------------------------



CREATE



Project structure



Reusable component architecture



Routing architecture



Authentication architecture



Database architecture



Theme architecture



Responsive architecture



------------------------------------------------



DESIGN SYSTEM



Style



Premium



Modern



Minimal



Healthcare



Soft shadows



Rounded corners



Excellent spacing



Mobile-first



Colors



Primary



#2E7D6B



Secondary



#F4F8F7



Accent



#4CAF50



Background



White



Typography



Modern



Readable



Accessible



------------------------------------------------



CREATE GLOBAL COMPONENTS



Navbar



Footer



Button



Input



Textarea



Dropdown



Search Bar



Card



Modal



Dialog



Drawer



Toast



Alert



Tabs



Accordion



Pagination



Avatar



Badge



Breadcrumb



Spinner



Skeleton Loader



Error Component



Empty State



Confirmation Dialog



Everything must be reusable.



------------------------------------------------



AUTHENTICATION



Build



Email Sign Up



Email Login



Google Login



Forgot Password



Reset Password



Protected Routes



Session Persistence



Logout



User Profile



------------------------------------------------



USER DASHBOARD



Build ONLY dashboard layout.



Include



Dashboard



Saved Clinics



My Reviews



Community



Treatment Journey



Profile



Settings



Logout



Do NOT build dashboard features yet.



------------------------------------------------



DATABASE



Create scalable Supabase tables.



Users



Clinics



ClinicImages



Services



Reviews



ReviewVerification



Questions



Answers



TreatmentJourney



SavedClinics



SavedComparisons



Notifications



Reports



Bookmarks



Create



Relationships



Indexes



Constraints



Policies



------------------------------------------------



STATE MANAGEMENT



Authentication



User



Theme



Notifications



Loading



------------------------------------------------



SECURITY



Authentication



Authorization



Row Level Security



Input Validation



File Validation



Image Validation



Rate Limiting Ready



------------------------------------------------



SEO



Meta Tags



Open Graph



robots.txt



sitemap.xml



Dynamic titles



------------------------------------------------



ACCESSIBILITY



Keyboard Navigation



ARIA Labels



Semantic HTML



WCAG



------------------------------------------------



PERFORMANCE



Lazy Loading



Code Splitting



Image Optimization



Caching Ready



------------------------------------------------



QUALITY



Strict TypeScript



Reusable Components



Clean Architecture



Scalable Folder Structure



No Console Errors



No Warnings



Production Ready



------------------------------------------------



DO NOT BUILD



Landing Page



Clinic Search



Clinic Profile



Anonymous Reviews



Community



Treatment Journey



Compare Clinics



IVF Cost Calculator



These will be built in later prompts.



------------------------------------------------



FINAL REQUIREMENT



Before finishing,



verify that



• every file compiles

• every import works

• routing works

• authentication works

• no duplicate components exist

• no runtime errors exist

• the project is ready for Prompt 2.



At the end, provide a summary of what was created and list any assumptions made.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/25f03be3-0302-4274-88f9-d3aa84fa8b9d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
