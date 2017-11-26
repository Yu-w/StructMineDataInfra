import React from 'react';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';

class SideBar extends React.Component {

  render() {
    return (
      <div>
        <List>
          <Subheader>Entities</Subheader>
          {this.props.articles.map(article =>
            <ListItem
              key={article.pmid}
              primaryText={article.title}
              secondaryText={
                <p>
                  <span style={{color: darkBlack}}>{article.pmid}</span> --
                  {article.subtitle}
                </p>
              }
              insetChildren={true}
              secondaryTextLines={2}
            />
          )}
        </List>
      </div>
    );
  }
}

export default SideBar;
