import { repositories } from './utils/repositories.js';
import { getOpenPullRequests } from './utils/github.js';
import { readStoredIssues, writeStoredIssues } from './utils/storage.js';
import { log } from 'console';

async function checkGoodFirstIssues() {
    const storedIssues = await readStoredIssues();

    for (const repo of repositories) {
        const issues = await getOpenPullRequests(repo);

        const newIssues = issues.filter(issue => !storedIssues.includes(issue.id));
        
        if (newIssues.length > 0) {
            log(`Good first issues encontradas em ${repo}:`);
            newIssues.forEach(issue => {
                log(`- ${issue.title} (${issue.html_url})`);
            });
            
            log(`achamos algo novo!`);

            storedIssues.push(...newIssues.map(issue => issue.id));
        } else {
            log(`Nenhuma good first issue nova em ${repo}.`);
        }
    }

    await writeStoredIssues(storedIssues);
}

checkGoodFirstIssues().catch(error => {
    error('Ocorreu um erro durante o monitoramento:', error);
    process.exit(1);
});
