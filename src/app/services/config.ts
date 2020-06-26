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
          'get-planets',
          'get-fleets',
          'start-travel',
        ],
        channels: [
          'create-civilization',
          'start-travel-notifications',
          'end-travel-notifications',
          'delete-fleet-notifications',
          'visibility-gain-notifications',
          'visibility-lost-notifications'
        ]
      }
    ]
  } 