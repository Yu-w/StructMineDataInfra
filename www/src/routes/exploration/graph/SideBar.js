import React from 'react';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import Highlighter from 'react-highlight-words';
import history from './../../../history';

class SideBar extends React.Component {

  render() {
    return (
      <div>
        <List>
          {this.props.articles.length
            ? <Subheader>Artities</Subheader>
            : <Subheader>Please select a node or edge to view corresponding articles</Subheader>
          }
          {this.props.articles.map(article =>
            <a href={'https://www.ncbi.nlm.nih.gov/pubmed/' + article.pmid} target="_blank">
              <ListItem
                key={article.pmid}
                primaryText={article.title}
                secondaryText={
                  <p>
                    <Highlighter
                      searchWords={article.highlights}
                      autoEscape={true}
                      textToHighlight={article.subtitle}
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
