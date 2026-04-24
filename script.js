async function explainCode() {
  const code = document.getElementById("codeInput").value;
  const outputDiv = document.getElementById("output");

  // Handle empty input
  if (!code.trim()) {
    outputDiv.innerText = "⚠️ Please enter some code";
    return;
  }

  outputDiv.innerText = "⏳ Analyzing code...";

  const prompt = `
Explain the following code in simple terms.
Also include:
1. What the code does
2. Step-by-step explanation
3. Time complexity

Code:
${code}
`;

  try {
    const result = await callGemini(prompt);
    outputDiv.innerHTML = result.replace(/\n/g, "<br>");
  } catch (error) {
    console.error(error);
    outputDiv.innerText = "❌ Error occurred. Check console.";
  }
}


// 🔥 GEMINI API FUNCTION
async function callGemini(prompt) {

 const API_KEY = "YOUR_API_KEY_HERE"; // 👈 put your key here

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  );

  const data = await response.json();
  console.log("API Response:", data);

  // Safe extraction
  if (data.candidates && data.candidates.length > 0) {
    return data.candidates[0].content.parts[0].text;
  } else if (data.error) {
    return "❌ API Error: " + data.error.message;
  } else {
    return "❌ No valid response from API.";
  }
}