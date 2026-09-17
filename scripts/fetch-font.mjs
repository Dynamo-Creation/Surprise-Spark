async function run() {
  try {
    const res = await fetch('https://www.dafontfree.io/download/madelyn-script/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.dafontfree.io/madelyn-font/'
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('HTML length:', html.length);
    
    // Look for form or download links
    const matches = html.match(/https?:\/\/[^\s"'<>]+\.(?:zip|otf|ttf)/gi) || [];
    console.log('Direct font links:', matches);

    // Look for wpdm download link or form
    const wpdm = html.match(/wpdm[^\s"'<>]+/gi) || [];
    console.log('Wpdm links:', wpdm.slice(0, 5));

    const forms = html.match(/<form[\s\S]*?<\/form>/gi) || [];
    console.log('Number of forms:', forms.length);
    for (const f of forms) {
      if (f.includes('download') || f.includes('wpdm')) {
        console.log('Form:', f.slice(0, 300));
      }
    }

    const btns = html.match(/<a[^>]+download[^>]*>[\s\S]*?<\/a>/gi) || [];
    console.log('Download a tags:', btns);
  } catch (err) {
    console.error('Error:', err);
  }
}
run();
