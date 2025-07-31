# AILA Certification Site (Organized)

This repository contains a reorganised version of the original
**AILA** (Artificial Intelligence Writing Literacy Association)
project.  The goal of this refactor is to tidy up the file
structure, eliminate duplicated code and provide a clear starting
point for further development.

## Structure

```
.
├── api/               – Express route modules
│   └── grade.js       – Handles grading requests via OpenAI API
├── pages/             – Static HTML pages for each section of the site
│   ├── index.html     – Home page
│   ├── exam.html      – AI writer certification test page
│   ├── members.html   – List of members
│   ├── member-detail-*.html – Detail pages for each member
│   ├── blog.html      – Blog overview page
│   └── article-chatgpt.html – Sample blog article
├── public/
│   ├── style.css      – Centralised styles used by all pages
│   └── js/
│       ├── common.js  – Shared UI interactions (header scroll, smooth links etc.)
│       └── grade.js   – Client logic for the exam page
├── server.js          – Express server entry point
├── package.json       – Project metadata and dependencies
└── vercel.json        – Rewrite rules for Vercel deployments
```

## Running Locally

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root and set your OpenAI API key:

   ```env
   OPENAI_API_KEY=sk-...
   ```

3. Start the development server:

   ```sh
   npm start
   ```

   The site will be available at `http://localhost:3000`.

## Notes

* The grading API remains unchanged from the original project; it
  forwards exam answers to OpenAI for scoring.
* All common scripts (header scroll, smooth scrolling, contact form
  handler and simple reveal animations) have been moved into
  `public/js/common.js` to avoid repetition.
* The CSS from the original project has been distilled into a
  simplified `style.css`.  You can extend this file with additional
  classes as your project grows.
* Placeholder content has been left in the blog and member pages to
  demonstrate the structure.  Feel free to replace this with your
  own content.

## License

This reorganised project is released under the MIT License.  See
`LICENSE` in the original repository for details.