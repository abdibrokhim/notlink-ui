/**
 * Response from the /shorten (and related) endpoint(s).
 * 
 * For free short URLs (no encryption / no payment):
 *   - `encrypted`, `expired`, and `transaction_hash` will be undefined.
 * 
 * For paid/encrypted/expirable URLs:
 *   - `encrypted`, `expired`, and `transaction_hash` may be present.
 */
export interface ShortURLResponse {
    id: number;
    original_url: string;
    short_code: string;
    created_at: string;
  
    // Only present if the URL is encrypted/paid/expirable
    encrypted?: boolean;
    expired?: boolean;
    transaction_hash?: string;
}
  
/**
 * Response from the wallet endpoints (/wcreate, /wupdate).
 */
export interface WalletResponse {
    id: number;
    wallet_address: string;
    tries_left: number;
    created_at: string;
}
