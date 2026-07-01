/**
 * Translates text between English and Bangla using the public Google Translate API.
 * 
 * @param text The text to translate
 * @param sl Source language code (e.g. 'en', 'bn', or 'auto')
 * @param tl Target language code (e.g. 'en', 'bn')
 * @returns The translated text string
 */
export async function translateText(text: string, sl: string = "auto", tl: string = "bn"): Promise<string> {
  if (!text || !text.trim()) return "";
  
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`
    );
    
    if (!response.ok) {
      throw new Error(`Translation HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data[0]) {
      // Map and join each translated segment
      const translatedResult = data[0]
        .map((segment: any) => segment[0])
        .filter(Boolean)
        .join("");
      return translatedResult;
    }
    
    throw new Error("Invalid response format from translation service");
  } catch (error) {
    console.error("Translation helper error:", error);
    throw new Error("Translation failed. Please try again.");
  }
}
