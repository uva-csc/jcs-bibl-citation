document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.bcf-citation-box');

    boxes.forEach(box => {
        const select = box.querySelector('#bcf-format');
        const output = box.querySelector('#bcf-output');
        const copyBtn = box.querySelector('.bcf-copy-btn');

        const data = {
            title: box.dataset.title,
            apatitle: box.dataset.apatitle,
            authors: JSON.parse(box.dataset.author),
            issue: box.dataset.issue,
            year: box.dataset.year,
            pages: box.dataset.pages,
            doi: '<a href="' + box.dataset.doi + '">' + box.dataset.doi + '</a>',
        };

        // console.log('data obj', data)

        function formatCitation(format) {
            // const authors = [...data.authors].map((a) => splitName(a));
            const jtitle = '<em>Journal of Contemplative Studies</em>';
            const trimtitle = data.title.trim();
            const atitle = `“${trimtitle}.”`;
            const apatitle = `${data.apatitle}. `;
            const auths = formatAuthors(data.authors, format);
            const issue = data.issue.replace(/^0+/, '');
            let citation = '';
            switch (format) {
                case 'apa':
                    citation = `${auths} (${data.year}). ${apatitle} ${jtitle}`;
                    if (data.issue !== 'none') {
                        citation += `, ${issue}`;
                    }
                    if (data.pages !== 'none') {
                        citation += `, ${data.pages}`;
                    }
                    citation += `. ${data.doi}.`;
                    return citation;

                case 'chicago':
                    citation = `${auths}. ${atitle} ${jtitle} `;
                    if (data.issue !== 'none') {
                        citation += `${issue} `;
                    }
                    citation += `(${data.year})`
                    if (data.pages !== 'none') {
                        citation += `: ${data.pages}`;
                    }
                    citation += `. ${data.doi}.`;
                    return citation;

                case 'mla':
                    citation = `${auths}. ${atitle} ${jtitle}, `;
                    if (data.issue !== 'none') {
                        citation += `vol. ${issue}, `;
                    }
                    citation += `${data.year}`
                    const ppref = data.pages.includes('–') ? 'pp.' : 'p.';
                    if (data.pages !== 'none') {
                        citation += `, ${ppref} ${data.pages}`;
                    }
                    citation += `, ${data.doi}.`;
                    return citation;
            }
        }

        // console.log("It's new!");

        function updateCitation() {
            output.innerHTML = formatCitation(select.value);
        }

        // Copy citation text to clipboard
        copyBtn.addEventListener('click', () => {
            const citationText = output.textContent.replace(/\s+/g, ' ');
            if (citationText) {
                navigator.clipboard.writeText(citationText)
                    .then(() => {
                        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">\n' +
                            '  <path fill="green" d="M9 16.2l-4.2-4.2 1.4-1.4 2.8 2.8 6.8-6.8 1.4 1.4z"/>\n' +
                            '</svg> Copied!';
                        setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
                    }).catch(err => {
                        console.error('Clipboard write failed:', err);
                        alert('Copy failed. Please copy manually.');
                    });
            }
        });

        select.addEventListener('change', updateCitation );
        updateCitation(); // initialize
    });
});


function formatAuthors(auths, style) {
    const newauths = auths.map((a, ind) => {
        const last_name = a.last_name[0].trim();
        const first_name = a.first_name[0].trim()
        let lastpref = '';
        switch(style) {
            case 'apa':
                if (auths.length > 1 && ind === auths.length -1) {
                    lastpref = '& ';
                }
                return `${lastpref}${last_name}, ${first_name[0]}.`;

            case 'chicago':
                if (auths.length > 1 && ind === auths.length - 1) {
                    lastpref = 'and ';
                }
                if (ind === 0) {
                    return `${last_name}, ${first_name}`;
                }
                return `${lastpref}${first_name} ${last_name}`;

            case 'mla':
                if (ind === 0) {
                    return `${last_name}, ${first_name}`;
                }
                if (ind === 1) {
                    // Just 2 authors use "and"
                    if (auths.length === 2) {
                        return `and ${first_name} ${last_name}`;
                    }
                    // More than 2 authors use "et al"
                    if (auths.length > 2) {
                        return ` et al`;
                    }
                }
                return ''; // authors more than 2 are turned into "et al".
            default:
                return 'default';
        }
    });
    // console.log("new authos", newauths);
    return newauths.filter(auth => auth !== '').join(', ');
}
