const WATCHTOWER_URL = process.env.WATCHTOWER_URL;
const WATCHTOWER_API_KEY = process.env.WATCHTOWER_API_KEY;
let _serviceId;
let _heartbeatInterval;
export async function sendEvent(event) {
    if (!WATCHTOWER_URL || !WATCHTOWER_API_KEY)
        return;
    try {
        await fetch(`${WATCHTOWER_URL}/api/ingest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": WATCHTOWER_API_KEY,
            },
            body: JSON.stringify({
                service: _serviceId,
                ...event,
            }),
        });
    }
    catch {
        // Silent fail — monitoring should never crash the app
    }
}
export function startHeartbeat(serviceId) {
    _serviceId = serviceId;
    sendEvent({ type: "heartbeat" });
    _heartbeatInterval = setInterval(() => {
        sendEvent({ type: "heartbeat" });
    }, 60_000);
}
export function stopHeartbeat() {
    if (_heartbeatInterval) {
        clearInterval(_heartbeatInterval);
        _heartbeatInterval = undefined;
    }
}
export function reportError(err, context) {
    sendEvent({
        type: "error",
        severity: "error",
        title: err.message,
        detail: { stack: err.stack, ...context },
    });
}
export function reportDeploy(version) {
    sendEvent({
        type: "deploy",
        title: `Deployed ${version || "latest"}`,
    });
}
