export interface WatchtowerEvent {
    service?: string;
    type: string;
    severity?: "info" | "warn" | "error" | "critical";
    title?: string;
    detail?: Record<string, unknown>;
}
export declare function sendEvent(event: WatchtowerEvent): Promise<void>;
export declare function startHeartbeat(serviceId: string): void;
export declare function stopHeartbeat(): void;
export declare function reportError(err: Error, context?: Record<string, unknown>): void;
export declare function reportDeploy(version?: string): void;
