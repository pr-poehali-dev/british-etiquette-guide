"""Переводчик английский ↔ русский через MyMemory API"""
import json
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
        text = body.get("text", "").strip()
        direction = body.get("direction", "en|ru")

        if not text:
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"error": "Текст не передан"}),
            }

        if len(text) > 500:
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"error": "Текст слишком длинный (макс. 500 символов)"}),
            }

        params = urllib.parse.urlencode({
            "q": text,
            "langpair": direction,
        })
        url = f"https://api.mymemory.translated.net/get?{params}"

        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())

        translated = data.get("responseData", {}).get("translatedText", "")
        status = data.get("responseStatus", 500)

        if status != 200 or not translated:
            return {
                "statusCode": 502,
                "headers": headers,
                "body": json.dumps({"error": "Не удалось получить перевод"}),
            }

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"translation": translated}),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": str(e)}),
        }
