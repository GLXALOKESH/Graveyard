export default class ErrorResponseDTO {
    private readonly status: number;
    private readonly apiPath: string;
    private readonly message: string;
    private readonly timestamp: string;
    private readonly details?: Record<string, unknown> | undefined;

    constructor(apiPath: string, status: number, message: string, details?: Record<string, unknown>) {
        this.status = status;
        this.apiPath = apiPath;
        this.message = message;
        this.timestamp = new Date().toISOString();
        this.details = details;
    }
}