import { restClient, websocketClient } from '@polygon.io/client-js';

// REST client for regular API calls
export const polygonRest = restClient(process.env.POLYGON_API_KEY!);

// WebSocket client for real-time data
export const polygonWs = websocketClient(process.env.POLYGON_API_KEY!);

// Helper function to subscribe to real-time stock updates
export const subscribeToStockUpdates = (symbols: string[], callback: (update: any) => void) => {
  polygonWs.stocks.subscribe(symbols);
  
  polygonWs.on('T', (trade) => {
    callback(trade);
  });

  return () => {
    polygonWs.stocks.unsubscribe(symbols);
  };
}; 