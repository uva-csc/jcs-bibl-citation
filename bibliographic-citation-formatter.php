<?php
/**
 * Plugin Name: Bibliographic Citation Formatter
 * Description: Displays a citation using ACF fields with selectable formats (APA, Chicago, etc.)
 * Version: 1.0
 * Author: Than Grove
 */

add_shortcode('citebibl', 'bcf_render_citation');
add_action('wp_enqueue_scripts', 'bcf_enqueue_scripts');

function bcf_enqueue_scripts() {
    wp_enqueue_script('bcf-script', plugin_dir_url(__FILE__) . 'bcf-script.js', [], false, true);
    wp_enqueue_style('bcf-style', plugin_dir_url(__FILE__) . 'bcf-style.css');
}

function bcf_render_citation() {
    if (!function_exists('get_field')) return '<p>ACF not active.</p>';

    $title = get_field('main_article_title');
    $subtitle = get_field('article_subtitle');
    if (strlen($subtitle) > 0) {
        $title .= ': ' . $subtitle;
    }
    $authors =  json_encode(get_authors());
    $issue_id = get_field('special_issue');
    $issue = get_field('issue_number', $issue_id);
    $year = get_field('dates');
    $pages = get_field('page_range');
    $pgrange = $pages['start_page'] . '-' . $pages['end_page'];
    $doi = get_field('doi');

    ob_start();
    ?>
    <div class="bcf-citation-box" data-title="<?= esc_attr($title) ?>"
         data-author="<?= esc_attr($authors) ?>" data-issue="<?= esc_attr($issue) ?>"
         data-year="<?= esc_attr($year['date_published']) ?>" data-pages="<?= esc_attr($pgrange) ?>"
         data-doi="<?= esc_attr($doi) ?>"
    >
        <div class="selector">
            <label for="bcf-format">Citation format:</label>
            <select id="bcf-format">
                <option value="apa">APA</option>
                <option value="chicago">Chicago</option>
            </select>
        </div>
        <div id="bcf-output" class="bcf-output"></div>
    </div>
    <?php
    return ob_get_clean();
}

function get_authors()
{
    $authors = get_field('article_authors');


    $clean_authors = array();

    foreach ($authors as $author){
        if ($author->ID){
            $clean_authors[] = get_post_meta($author->ID); //display_article_author($author);
        }
    }
    return $clean_authors;
}

function display_article_author($author, $institution=0)
{
    $fullname = get_field('first_name',$author->ID) . ' ' . get_field('middle_name',$author->ID) . ' ' . get_field('last_name',$author->ID);
    $author_id = $author->ID;
    if ($institution == '1'){
        $institution = get_field('institution',$author->ID);
        return '<a href="/author-listing#author-' . $author_id  . '">' . $fullname . '</a>, ' . $institution;
    }
    else {
        return $fullname;
    }
}
