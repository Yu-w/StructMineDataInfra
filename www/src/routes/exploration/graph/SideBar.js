import React from 'react';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';

export default class SideBar extends React.Component {

  render() {
    return (
      <div>
        <List>
          <Subheader>Entities</Subheader>
          <ListItem
            primaryText="Brunch this weekend?"
            secondaryText={
              <p>
                <span style={{color: darkBlack}}>Brendan Lim</span> --
                I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
              </p>
            }
            insetChildren={true}
            secondaryTextLines={2}
          />
          <Divider inset={true} />
          <ListItem
            primaryText={
              <p>Summer BBQ&nbsp;&nbsp;<span style={{color: lightBlack}}>4</span></p>
            }
            secondaryText={
              <p>
                <span style={{color: darkBlack}}>to me, Scott, Jennifer</span> --
                Wish I could come, but I&apos;m out of town this weekend.
              </p>
            }
            insetChildren={true}
            secondaryTextLines={2}
          />
          <Divider inset={true} />
          <ListItem
            primaryText="Oui oui"
            secondaryText={
              <p>
                <span style={{color: darkBlack}}>Grace Ng</span> --
                Do you have Paris recommendations? Have you ever been?
              </p>
            }
            insetChildren={true}
            secondaryTextLines={2}
          />
          <Divider inset={true} />
          <ListItem
            primaryText="Birdthday gift"
            secondaryText={
              <p>
                <span style={{color: darkBlack}}>Kerem Suer</span> --
                Do you have any ideas what we can get Heidi for her birthday? How about a pony?
              </p>
            }
            insetChildren={true}
            secondaryTextLines={2}
          />
          <Divider inset={true} />
          <ListItem
            primaryText="Recipe to try"
            secondaryText={
              <p>
                <span style={{color: darkBlack}}>Raquel Parrado</span> --
                We should eat this: grated squash. Corn and tomatillo tacos.
              </p>
            }
            insetChildren={true}
            secondaryTextLines={2}
          />
        </List>
      </div>
    );
  }
}
