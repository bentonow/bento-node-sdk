import { Analytics } from '../src';

describe('Get Form Responses [/fetch/responses]', () => {
  it('Works with the form ID', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.Forms.getResponses('test-formid-1234')
    ).resolves.toMatchObject([
      {
        id: '159765112',
        type: 'events',
        attributes: {
          uuid: '7e56e5c8-05ae-42e9-97bb-25f68bccf28e',
          data: {
            id: '7e56e5c8-05ae-42e9-97bb-25f68bccf28e',
            ip: '119.47.252.96',
            date: '2021-08-21T09:18:12.000+00:00',
            page: {
              url:
                'https://app.bentonow.com/f/06ef3ada3b32a7f7dac762f5a788724d/test-formid-1234',
              host: 'app.bentonow.com',
              path: '/f/06ef3ada3b32a7f7dac762f5a788724d/test-formid-1234',
              protocol: 'https:',
              referrer: 'https://app.bentonow.com/account/survey_forms/198',
            },
            site: '06ef3ada3b32a7f7dac762f5a788724d',
            type: '$surveyFormCompleted',
            visit: 'a5a0c386-3e24-4378-9f63-d1e6ff74ce5a',
            fields: {
              last_name: 'Form',
              question1: 'item1',
              question2: ['item3'],
              question3:
                'This is to test the response\n\nOf this form.\n\nFor testing.',
              question4: '3',
              question5: 'item2',
              question6: '',
              first_name: 'Test',
            },
            browser: {
              width: '1920',
              height: '961',
              user_agent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 Edg/92.0.902.78',
            },
            details: {
              'survey-form-test-formid-1234': {
                email: 'test@bentonow.com',
                last_name: 'Form',
                question1: 'item1',
                question2: ['item3'],
                question3:
                  'This is to test the response\n\nOf this form.\n\nFor testing.',
                question4: '3',
                question5: 'item2',
                question6: '',
                first_name: 'Test',
              },
              'survey-form-test-formid-1234-submitted': 'true',
            },
            visitor: '763f821e-f218-4e68-acf3-e008297e4f67',
            identity: {
              email: 'test@bentonow.com',
            },
            location: {
              ip: 'XXX.XX.XXX.XX',
              request: 'XXX.XX.XXX.XX',
              latitude: 0.0,
              city_name: 'Earth',
              longitude: 0.0,
              postal_code: '00000',
              region_name: '00',
              country_name: 'Country',
              country_code2: 'CO',
              country_code3: 'COU',
              continent_code: 'EA',
              real_region_name: 'Earth',
            },
          },
        },
      },
    ]);
  });
});

describe('Post Fields [/fetch/fields]', () => {
  it('Works with a key.', async () => {
    const bento = new Analytics({
      authentication: {
        secretKey: 'test',
        publishableKey: 'test',
      },
      siteUuid: 'test',
    });

    await expect(
      bento.Fields.createField({
        key: 'test',
      })
    ).resolves.toMatchObject([
      {
        id: '2327',
        type: 'visitors-fields',
        attributes: {
          name: 'Test',
          key: 'test',
          whitelisted: null,
          created_at: '2021-08-21T02:08:30.364Z',
        },
      },
    ]);
  });
});
