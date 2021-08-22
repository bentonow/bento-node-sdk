import { BentoClient } from '../client';
import { DataResponse } from '../client/types';
import { CreateFieldParameters, Field } from './types';

export class BentoFields {
  private readonly _url = '/fetch/fields';

  constructor(private readonly _client: BentoClient) {}

  /**
   * Returns all of the fields for the site.
   *
   * @returns Promise<Field[]>
   */
  public async getFields(): Promise<Field[] | null> {
    try {
      const result = await this._client.get<DataResponse<Field[]>>(this._url);

      if (Object.keys(result).length === 0 || !result.data) return null;
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a field inside of Bento. The name of the field is automatically generated
   * from the key that is passed in upon creation. For example
   *  - Key: `thisIsAKey`
   *    Name: `This Is A Key`
   *  - Key: `this is a key`
   *    Name: `This Is A Key`
   *  - Key: `this-is-a-key`
   *    Name: `This Is A Key`
   *  - Key: `this_is_a_key`
   *    Name: `This Is A Key`
   *
   * @param parameters \{ key: string \}
   * @returns Promise<Field[]>
   */
  public async createField(
    parameters: CreateFieldParameters
  ): Promise<Field[] | null> {
    try {
      const result = await this._client.post<DataResponse<Field[]>>(this._url, {
        field: parameters,
      });

      if (Object.keys(result).length === 0 || !result.data) return null;
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}
