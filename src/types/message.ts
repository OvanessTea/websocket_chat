export type Message = {
    id: string;
    user: string;
    text: string;
    timestamp: Date;
    roomId?: string;
}