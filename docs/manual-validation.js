import { Analytics } from '../dist/index.js';

const analytics = new Analytics({
  authentication: {
    publishableKey: process.env.BENTO_PUBLISHABLE_KEY,
    secretKey: process.env.BENTO_SECRET_KEY,
  },
  siteUuid: process.env.BENTO_SITE_UUID,
});

async function main() {
  console.log('Workflows (page 1)');
  console.dir(await analytics.V1.Workflows.getWorkflows({ page: 1 }), { depth: 2 });

  console.log('Sequences (page 1)');
  const sequences = await analytics.V1.Sequences.getSequences({ page: 1 });
  console.dir(sequences, { depth: 2 });

  if (process.env.BENTO_SEQUENCE_PREFIX_ID) {
    const created = await analytics.V1.Sequences.createSequenceEmail(
      process.env.BENTO_SEQUENCE_PREFIX_ID,
      {
        subject: 'SDK Validation Email',
        html: '<p>Sent from SDK validation script</p>',
      }
    );
    console.log('Created sequence email:', created?.id);
  }

  if (process.env.BENTO_TEMPLATE_ID) {
    const updated = await analytics.V1.EmailTemplates.updateEmailTemplate({
      id: Number(process.env.BENTO_TEMPLATE_ID),
      subject: 'SDK Validation Update',
      html: '<p>Updated via SDK validation script</p>',
    });
    console.log('Updated template subject:', updated?.attributes.subject);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
