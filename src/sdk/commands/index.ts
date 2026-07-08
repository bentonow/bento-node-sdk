import type { BentoClient } from '../client';
import { CommandTypes } from './enums';
import type {
  AddFieldParameters,
  AddTagParameters,
  ChangeEmailParameters,
  CommandResult,
  RemoveFieldParameters,
  RemoveTagParameters,
  SubscribeParameters,
  UnsubscribeParameters,
} from './types';

export class BentoCommands<S> {
  private readonly _url = '/fetch/commands';

  constructor(private readonly _client: BentoClient) {}

  /**
   * **This does not trigger automations!** - If you wish to trigger automations, please use the
   * core module's `tagSubscriber` method.
   *
   * Adds a tag to the subscriber with the matching email.
   *
   * Note that both the tag and the subscriber will be created if either is missing
   * from system.
   *
   *
   * @param parameters \{ email: string, tagName: string \}
   * @returns Promise\<number\> Number of commands queued
   */
  public async addTag(parameters: AddTagParameters): Promise<number> {
    const result = await this._client.post<CommandResult>(this._url, {
      command: {
        command: CommandTypes.ADD_TAG,
        email: parameters.email,
        query: parameters.tagName,
      },
    });

    return result.results;
  }

  /**
   * Removes the specified tag from the subscriber with the matching email.
   *
   * @param parameters \{ email: string, tagName: string \}
   * @returns Promise\<number\> Number of commands queued
   */
  public async removeTag(parameters: RemoveTagParameters): Promise<number> {
    const result = await this._client.post<CommandResult>(this._url, {
      command: {
        command: CommandTypes.REMOVE_TAG,
        email: parameters.email,
        query: parameters.tagName,
      },
    });

    return result.results;
  }

  /**
   * **This does not trigger automations!** - If you wish to trigger automations, please use the
   * core module's `updateFields` method.
   *
   * Adds a field to the subscriber with the matching email.
   *
   * Note that both the field and the subscriber will be created if either is missing
   * from system.
   *
   * @param parameters \{ email: string, field: \{ key: string; value: string; \} \}
   * @returns Promise\<number\> Number of commands queued
   */
  public async addField(parameters: AddFieldParameters<S>): Promise<number> {
    const result = await this._client.post<CommandResult>(this._url, {
      command: {
        command: CommandTypes.ADD_FIELD,
        email: parameters.email,
        query: parameters.field,
      },
    });

    return result.results;
  }

  /**
   * Removes a field to the subscriber with the matching email.
   *
   * @param parameters \{ email: string, fieldName: string \}
   * @returns Promise\<number\> Number of commands queued
   */
  public async removeField(parameters: RemoveFieldParameters<S>): Promise<number> {
    const result = await this._client.post<CommandResult>(this._url, {
      command: {
        command: CommandTypes.REMOVE_FIELD,
        email: parameters.email,
        query: parameters.fieldName,
      },
    });

    return result.results;
  }

  /**
   * **This does not trigger automations!** - If you wish to trigger automations, please use the
   * core module's `addSubscriber` method.
   *
   * Subscribes the supplied email to Bento. If the email does not exist, it is created.
   * If the subscriber had previously unsubscribed, they will be re-subscribed.
   *
   * @param parameters \{ email: string \}
   * @returns Promise\<number\> Number of commands queued
   */
  public async subscribe(parameters: SubscribeParameters): Promise<number> {
    const result = await this._client.post<CommandResult>(this._url, {
      command: {
        command: CommandTypes.SUBSCRIBE,
        email: parameters.email,
      },
    });

    return result.results;
  }

  /**
   * **This does not trigger automations!** - If you wish to trigger automations, please use the
   * core module's `removeSubscriber` method.
   *
   * Unsubscribes the supplied email to Bento. If the email does not exist, it is created and
   * immediately unsubscribed. If they had already unsubscribed, the `unsubscribed_at` property
   * is updated.
   *
   * @param parameters \{ email: string \}
   * @returns Promise\<number\> Number of commands queued
   */
  public async unsubscribe(parameters: UnsubscribeParameters): Promise<number> {
    const result = await this._client.post<CommandResult>(this._url, {
      command: {
        command: CommandTypes.UNSUBSCRIBE,
        email: parameters.email,
      },
    });

    return result.results;
  }

  /**
   * Updates the email of a user in Bento.
   *
   * @param parameters \{ oldEmail: string, newEmail: string \}
   * @returns Promise\<number\> Number of commands queued
   */
  public async changeEmail(parameters: ChangeEmailParameters): Promise<number> {
    const result = await this._client.post<CommandResult>(this._url, {
      command: {
        command: CommandTypes.CHANGE_EMAIL,
        email: parameters.oldEmail,
        query: parameters.newEmail,
      },
    });

    return result.results;
  }
}
