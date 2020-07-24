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
          'get-fleet-ships',
          'get-visible-colonies',
          'get-stars-with-presence',
          'get-explored-stars',
          'create-colony',
          'build-ship',
          'get-building-orders',
          'get-known-civilizations',
        ],
        channels: [
          'create-civilization',
          'start-travel-notifications',
          'end-travel-notifications',
          'delete-fleet-notifications',
          'visibility-gain-notifications',
          'visibility-lost-notifications',
          'explore-star-notifications',
          'create-colony-notifications',
          'create-ship-notifications',
          'building-orders-notifications',
          'civilization-meet-notifications',
        ]
      }
    ]
  } 