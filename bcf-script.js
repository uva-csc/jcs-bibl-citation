document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.bcf-citation-box');

    boxes.forEach(box => {
        const select = box.querySelector('#bcf-format');
        const output = box.querySelector('#bcf-output');

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
                    return `${auths} (${data.year}). ${data.title}. ${jtitle}, ${data.issue}, ${data.pages}. 
                            <a href="${data.doi}">${data.doi}</a>.`;
                case 'chicago':
                    return `${auths} "${data.title}." ${jtitle} ${data.issue} (${data.year}): ${data.pages}.
                            <a href="${data.doi}">${data.doi}</a>.`;
                case 'mla':
                    return `${auths} "${data.title}." ${jtitle}, vol. ${data.issue}, ${data.year}, ${data.pages}.
                            <a href="${data.doi}">${data.doi}</a>.`
                default:
                    return 'No style selected';
            }
        }

        function updateCitation() {
            output.innerHTML = formatCitation(select.value);
        }

        select.addEventListener('change', updateCitation);
        updateCitation(); // initialize
    });
});


function formatAuthors(auths, style) {
    const newauths = auths.map((a, ind) => {
        let lastpref = '';
        switch(style) {
            case 'apa':
                if (auths.length > 1 && ind === auths.length -1) {
                    lastpref = '& ';
                }
                return `${lastpref}${a.last_name}, ${a.first_name[0][0]}.`;
            case 'chicago':
                if (auths.length > 1 && ind === auths.length - 1) {
                    lastpref = 'and ';
                }
                return `${lastpref}${a.first_name} ${a.last_name}`;
            case 'mla':
                if (auths.length > 1 && ind === auths.length - 1) {
                    lastpref = 'and ';
                }
                if (ind === 0) {
                    return `${a.last_name}, ${a.first_name}`;
                }
                return `${lastpref}${a.first_name} ${a.last_name}`;
            default:
                return 'default';
        }
    });
    return newauths.join(', ');
}
