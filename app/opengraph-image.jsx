import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "PixelPatterns - Create Seamless Pixel Art Patterns";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "20px",
                    }}
                >
                    <div
                        style={{
                            fontSize: 88,
                            fontWeight: "bold",
                            letterSpacing: "-0.05em",
                            display: "flex",
                            alignItems: "center",
                            gap: "24px",
                        }}
                    >
                        <div
                            style={{
                                width: 80,
                                height: 80,
                                background: "white",
                                borderRadius: 16,
                                display: "flex",
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 10,
                                    left: 10,
                                    width: 60,
                                    height: 60,
                                    display: "flex",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div style={{ width: 20, height: 20, background: "#667eea" }} />
                                <div style={{ width: 20, height: 20, background: "#764ba2" }} />
                                <div style={{ width: 20, height: 20, background: "#f093fb" }} />
                                <div style={{ width: 20, height: 20, background: "#764ba2" }} />
                                <div style={{ width: 20, height: 20, background: "#667eea" }} />
                                <div style={{ width: 20, height: 20, background: "#f093fb" }} />
                                <div style={{ width: 20, height: 20, background: "#f093fb" }} />
                                <div style={{ width: 20, height: 20, background: "#667eea" }} />
                                <div style={{ width: 20, height: 20, background: "#764ba2" }} />
                            </div>
                        </div>
                        PixelPatterns
                    </div>
                    <div
                        style={{
                            fontSize: 36,
                            fontWeight: "normal",
                            letterSpacing: "0.02em",
                            opacity: 0.95,
                            maxWidth: "900px",
                            textAlign: "center",
                        }}
                    >
                        Create Seamless Pixel Art Patterns
                    </div>
                    <div
                        style={{
                            fontSize: 24,
                            fontWeight: "normal",
                            opacity: 0.85,
                            marginTop: 10,
                        }}
                    >
                        Free Online Editor • Export • Share
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
