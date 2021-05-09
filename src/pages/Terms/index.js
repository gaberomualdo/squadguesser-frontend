import React from 'react';
import { ContentfulPage } from '../../components';

export default function Terms() {
  return (
    <ContentfulPage title='Terms & Cookie Policy' description={`Read more about how this site works and our terms.`}>
      <p>
        <strong>1.</strong> This site uses Cookies to track site usage, save sign in data, and more. This site also uses HTML5 Local Storage to save
        other miscellaneous data. By using this site, you agree to our use of Cookies and HTML5 Local Storage for the specified purposes.
      </p>
      <p>
        <strong>2.</strong> If you are signed up for an account in this site, we will store additional information such as game history and
        statistics, leaderboard standings, and username and password information so that you may sign in. We do not guarantee the security of this
        data and will not be held liable for any damages in relation to the security of this stored data. By signing up for an account, you agree that
        you have read and understand this. To delete your account and its associated data, you may do so by clicking on the profile icon on the top
        right, scrolling down to Settings, and clicking Delete Account. If you are having trouble accessing your account, please contact us via the
        email in the footer of this site.
      </p>
      <p>
        <strong>3.</strong> This site and its usage is provided on an 'AS IS' basis, with no guarantees or warranties of any kind. The authors of this
        site shall not be held liable for any damages or claim relating to the usage of this site.
      </p>
      <p>
        <strong>4.</strong> Users of this site may not use bots, scrapers, or other automated programs or tools to access this site, unless the bot or
        spider is that of a search engine such as Google Search. Users of this site may not attempt to reverse engineer the site, its functionality,
        its data, its API, or anything else in relation to the site.
      </p>
    </ContentfulPage>
  );
}
