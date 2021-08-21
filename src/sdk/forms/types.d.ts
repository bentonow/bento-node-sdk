import {
  BaseEntity,
  BrowserData,
  IdentityData,
  LocationData,
  PageData,
} from '../types';

/**
 * Core Form Types
 */

export type FormResponseData = {
  browser: BrowserData;
  date: string;
  details: { [key: string]: any };
  fields: { [key: string]: any };
  id: string;
  identity: IdentityData;
  ip: string;
  location: LocationData;
  page: PageData;
  site: string;
  type: string;
  visit: string;
  visitor: string;
};

export type FormResponseAttributes = {
  data: FormResponseData;
  uuid: string;
};

export type FormResponse = BaseEntity<FormResponseAttributes>;
