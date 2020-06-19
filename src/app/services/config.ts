import { PirosApiServiceConfig } from '@piros/api';

export const config: PirosApiServiceConfig = {
    services: [
      {
        id: 'civilizations',
        url: 'ws://localhost:3001/',
        requestTypes: [
          'get-civilization',
          'create-civilization',
          'get-stars',
          'get-planets'
        ],
        channels: [
          'create-civilization'
        ]
      }
    ]
  } 