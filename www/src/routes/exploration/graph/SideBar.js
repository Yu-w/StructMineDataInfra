import React from 'react';

import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
import Highlighter from 'react-highlight-words';
import history from './../../../history';
import { StringUtils } from '../../Utils';

class SideBar extends React.Component {

  render() {
    return (
      <div>
        <List>
          <Subheader>{this.props.title}</Subheader>
          {this.props.articles.map(article =>
            <a key={article.pmid + 'href'} href={'https://www.ncbi.nlm.nih.gov/pubmed/' + article.pmid} target="_blank">
              <ListItem
                key={article.pmid}
                primaryText={article.title}
                secondaryText={
                  <p>
                    <Highlighter
                      searchWords={article.highlights}
                      autoEscape={true}
                      textToHighlight={StringUtils.trimStringWithHighlight(article.subtitle, article.highlights[0])}
                    />
                  </p>
                }
                insetChildren={true}
                secondaryTextLines={2}
              />
            </a>
          )}
        </List>
      </div>
    );
  }
}

export default SideBar;
