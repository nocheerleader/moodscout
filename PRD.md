
# MoodScout Product Requirements Document (PRD)

## Product Overview
MoodScout is a sentiment and tone analysis tool designed specifically for neurodiverse individuals who need help interpreting the emotional tone of text in social media and emails. Using a neo-brutalist design aesthetic, the application provides clear, accessible feedback on the sentiment and emotional tone of text.

## Target Audience
- Neurodiverse individuals (including those with autism, ADHD, etc.)
- People who struggle with interpreting emotional cues in text
- Anyone seeking to better understand how their written communication might be perceived

## Core Problem Statement
Neurodiverse individuals often struggle with interpreting emotional and social cues in written communication, leading to misunderstandings and anxiety around digital communication. MoodScout aims to reduce this friction by providing clear analysis of text sentiment and tone.

## Product Goals
1. Create an intuitive interface for text analysis
2. Provide clear, actionable insights about text sentiment and tone
3. Allow users to track and review their analysis history
4. Maintain a consistent neo-brutalist design language
5. Ensure accessibility for neurodiverse users

## Technical Architecture
- Frontend: React with Tailwind CSS (neo-brutalist styling)
- Backend: Supabase for authentication and database
- AI: Anthropic API for sentiment and tone analysis

## Key Features

### MVP (Phase 1)
- User authentication (signup, login, logout)
- Text input interface for analysis
- Basic sentiment analysis using Anthropic API
- Simple results display
- Saving analysis to history
- Viewing analysis history

### Phase 2
- Integrate with Eleven Labs API, two features: 
- (A) "Hear the Tone" (TTS with Voice Styling): After analysis, identify the primary detected tone (e.g., "Sarcastic," "Angry," "Friendly," "Formal"). Use ElevenLabs' voice settings (if available/controllable via API for different styles/emotions within one voice, or by picking different pre-made voices mapped to tones) to read the original input text aloud in that tone.
- (B) "Calm Explanation" Mode (TTS - Specific Voice): Offer an option to have the analysis read aloud by a specifically chosen, calm, reassuring, and clear ElevenLabs voice, designed to reduce anxiety when dealing with potentially negative or confusing results.

## User Flow
1. User arrives at landing page
2. User signs up/logs in
3. User is directed to the analysis tool
4. User inputs text for analysis
5. System processes text through Anthropic API
6. Results are displayed to the user
7. Analysis is saved to history
8. User can view past analyses

## Database Schema

### Users Table
- id (primary key)
- email
- created_at
- last_login

### Analyses Table
- id (primary key)
- user_id (foreign key)
- input_text
- analysis_result (JSON)
- created_at
- tags (optional)

## API Integration

### Anthropic API
- Endpoint: Claude API
- Input: User's text
- Expected output: JSON containing sentiment analysis, tone identification, and potential improvements
- Error handling for rate limits and service unavailability

## UI/UX Guidelines

### Neo-Brutalist Design Elements
- Bold, contrasting colors
- Exaggerated shadows
- Playful typography
- Visible structural elements
- Intentional "roughness" in design
- Clear boundaries between elements

### Color Palette
- Primary: #FF5A5F (bright red)
- Secondary: #3A86FF (electric blue)
- Accent: #FCBF49 (sunshine yellow)
- Background: #F8F9FA (off-white)
- Text: #212529 (near-black)
- Error: #D62828 (dark red)
- Success: #70E000 (lime green)

### Typography
- Headings: Space Grotesk (bold, distinctive)
- Body: Inter (clear, accessible)
- Use large, readable font sizes
- High contrast for readability

### Accessibility Considerations
- Clear, descriptive labels for all interactive elements
- Sufficient color contrast
- Keyboard navigation support
- Reduced motion option
- Simple, predictable interactions
- Clear success/error states
- Minimal use of metaphors or idioms

## Development Phases

### Phase 1: MVP -> COMPLETED 
- Create project setup and landing page
- Implement user authentication with Supabase
- Build basic analyzer interface
- Integrate Anthropic API
- Create simple results display
- Implement analysis history storage and retrieval
- Deploy basic working version

### Phase 2: Eleven Labs    
- Integrate the Eleven Labs API 
- Add "Hear the Tone" feature 
- Add "Calm Explanation" Mode 

## Success Metrics
- User signup and retention rates
- Number of analyses performed per user
- User satisfaction scores
- Time spent reviewing analysis results
- Return rate and recurring usage

## Open Questions & Considerations
- How to handle privacy concerns with sensitive text data?
- What level of detail in analysis is most helpful without being overwhelming?
- How to balance playful neo-brutalist design with accessibility needs?
- What additional context might help improve analysis accuracy?

## Conclusion
MoodScout aims to provide neurodiverse individuals with a tool that reduces anxiety and improves confidence in digital communication by offering clear insights into the emotional tone of text. By following this phased approach and focusing on user needs, we can build a product that makes a meaningful difference in users' lives.
