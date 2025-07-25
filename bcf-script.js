document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.bcf-citation-box');

    boxes.forEach(box => {
        const select = box.querySelector('#bcf-format');
        const output = box.querySelector('#bcf-output');
        const copyBtn = box.querySelector('.bcf-copy-btn');

        const data = {
            title: box.dataset.title,
            authors: JSON.parse(box.dataset.author),
            issue: box.dataset.issue * 1,
            year: box.dataset.year.split(', ')[1],
            pages: box.dataset.pages,
            doi: box.dataset.doi
        };

        console.log('data obj', data)

        function formatCitation(format) {
            // const authors = [...data.authors].map((a) => splitName(a));
            const jtitle = '<em>Journal of Contemplative Studies</em>';
            const auths = formatAuthors(data.authors, format);
            switch (format) {
                case 'apa':
                    return `${auths} (${data.year}). ${data.title}. ${jtitle}, ${data.issue}, ${data.pages}. ${data.doi}.`;
                case 'chicago':
                    return `${auths}. "${data.title}." ${jtitle} ${data.issue} (${data.year}): ${data.pages}. ${data.doi}.`;
                case 'mla':
                    return `${auths}. "${data.title}." ${jtitle}, vol. ${data.issue}, ${data.year}, ${data.pages}. ${data.doi}.`;
                default:
                    return 'No style selected';
            }
        }

        function updateCitation() {
            output.innerHTML = formatCitation(select.value);
        }

        // Copy citation text to clipboard
        copyBtn.addEventListener('click', () => {
            const citationText = output.textContent.replace(/\s+/g, ' ');
            if (citationText) {
                navigator.clipboard.writeText(citationText).then(() => {
                    copyBtn.textContent = '✅ Copied!';
                    setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
                });
            }
        });

        select.addEventListener('change', updateCitation);
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
                return `${lastpref}${first_name} ${last_name}`;
            case 'mla':
                if (auths.length > 1 && ind === auths.length - 1) {
                    lastpref = 'and ';
                }
                if (ind === 0) {
                    return `${last_name}, ${first_name}`;
                }
                return `${lastpref}${first_name} ${last_name}`;
            default:
                return 'default';
        }
    });
    return newauths.join(', ');
}
