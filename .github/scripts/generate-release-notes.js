module.exports = async ({github, context}) => {
  // Get the latest tag
  const { data: tags } = await github.rest.repos.listTags({
    owner: context.repo.owner,
    repo: context.repo.repo,
    per_page: 1
  });

  const latestTag = tags[0]?.name || '';

  // Get commits since last tag
  const { data: commits } = await github.rest.repos.compareCommits({
    owner: context.repo.owner,
    repo: context.repo.repo,
    base: latestTag || 'master~1',
    head: 'master'
  });

  // Get PRs
  const { data: pulls } = await github.rest.pulls.list({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'closed',
    sort: 'updated',
    direction: 'desc',
    per_page: 100
  });

  // Filter merged PRs since last release
  const mergedPRs = pulls.filter(pr => {
    return pr.merged_at && (!latestTag || new Date(pr.merged_at) > new Date(tags[0]?.created_at));
  });

  // Helper function to determine type from text
  const getChangeType = (subject, body = '') => {
    const text = `${subject}\n${body}`.toLowerCase();
    if (text.includes('breaking change') || text.includes('breaking:')) return 'breaking';
    if (text.includes('feat:') || text.includes('feature:') || text.includes('enhancement:')) return 'feature';
    if (text.includes('fix:') || text.includes('bug:')) return 'bug';
    if (text.includes('doc:') || text.includes('docs:')) return 'docs';
    if (text.includes('chore:') || text.includes('refactor:') || text.includes('style:')) return 'maintenance';
    return 'other';
  };

  // Categorize changes
  const categories = {
    '🚀 New Features': {
      commits: commits.commits.filter(commit =>
        getChangeType(commit.commit.message) === 'feature'
      ),
      prs: mergedPRs.filter(pr =>
        getChangeType(pr.title, pr.body) === 'feature'
      )
    },
    '🐛 Bug Fixes': {
      commits: commits.commits.filter(commit =>
        getChangeType(commit.commit.message) === 'bug'
      ),
      prs: mergedPRs.filter(pr =>
        getChangeType(pr.title, pr.body) === 'bug'
      )
    },
    '📚 Documentation': {
      commits: commits.commits.filter(commit =>
        getChangeType(commit.commit.message) === 'docs'
      ),
      prs: mergedPRs.filter(pr =>
        getChangeType(pr.title, pr.body) === 'docs'
      )
    },
    '🔧 Maintenance': {
      commits: commits.commits.filter(commit =>
        getChangeType(commit.commit.message) === 'maintenance'
      ),
      prs: mergedPRs.filter(pr =>
        getChangeType(pr.title, pr.body) === 'maintenance'
      )
    },
    '🔄 Other Changes': {
      commits: commits.commits.filter(commit =>
        getChangeType(commit.commit.message) === 'other'
      ),
      prs: mergedPRs.filter(pr =>
        getChangeType(pr.title, pr.body) === 'other'
      )
    }
  };

  // Generate markdown
  let markdown = '## What\'s Changed\n\n';

  // Add breaking changes first
  const breakingChanges = [
    ...commits.commits.filter(commit => getChangeType(commit.commit.message) === 'breaking'),
    ...mergedPRs.filter(pr => getChangeType(pr.title, pr.body) === 'breaking')
  ];

  if (breakingChanges.length > 0) {
    markdown += '⚠️ **Breaking Changes**\n\n';
    breakingChanges.forEach(change => {
      if ('number' in change) { // It's a PR
        markdown += `* ${change.title} (#${change.number})\n`;
      } else { // It's a commit
        const firstLine = change.commit.message.split('\n')[0];
        markdown += `* ${firstLine} (${change.sha.substring(0, 7)})\n`;
      }
    });
    markdown += '\n';
  }

  // Add categorized changes
  for (const [category, items] of Object.entries(categories)) {
    if (items.commits.length > 0 || items.prs.length > 0) {
      markdown += `### ${category}\n\n`;

      // Add PRs first
      items.prs.forEach(pr => {
        markdown += `* ${pr.title} (#${pr.number}) @${pr.user.login}\n`;
      });

      // Add commits that aren't associated with PRs
      items.commits
        .filter(commit => !items.prs.some(pr => pr.merge_commit_sha === commit.sha))
        .forEach(commit => {
          const firstLine = commit.commit.message.split('\n')[0];
          markdown += `* ${firstLine} (${commit.sha.substring(0, 7)}) @${commit.author?.login || commit.commit.author.name}\n`;
        });

      markdown += '\n';
    }
  }

  // Add contributors section
  const contributors = new Set([
    ...mergedPRs.map(pr => pr.user.login),
    ...commits.commits.map(commit => commit.author?.login || commit.commit.author.name)
  ]);

  if (contributors.size > 0) {
    markdown += '## Contributors\n\n';
    [...contributors].forEach(contributor => {
      markdown += `* ${contributor.includes('@') ? contributor : '@' + contributor}\n`;
    });
  }

  return markdown;
}