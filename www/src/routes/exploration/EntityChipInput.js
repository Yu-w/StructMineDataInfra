import React from 'react';
import ChipInput from 'material-ui-chip-input';
import Chip from 'material-ui/Chip';
import ActionExploreIcon from 'material-ui/svg-icons/action/explore';
import Tooltip from 'rc-tooltip';
import Snackbar from 'material-ui/Snackbar';

export default class SearchBar extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      entityChips: [],
      openSnackbar: false,
      onChipInput: false,
      autocompleteClose: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.category !== this.props.category) {
      this.setState({ entityChips: [] })
    }
  }

  handleChipChange = () => {
    this.props.onChange(this.state.entityChips);
  }

  handleChipAddRequest = (chip) => {
    if (this.props.dataSource.indexOf(chip) >= 0) {
      this.setState({entityChips: this.state.entityChips.concat([chip])}, this.handleChipChange);
    } else {
      this.setState({openSnackbar: true})
    }
  }

  handleChipDeleteRequest = (chip, index) => {
    const chips = this.state.entityChips.filter(x => x !== chip);
    this.setState({entityChips: chips}, this.handleChipChange);
  }

  handleChipInputFocus = () => {
    this.setState({onChipInput: true}, this.props.onChipEditing(true));
  }

  handleAutocompleteOnClose = () => {
    this.setState({autocompleteClose: true});
    setTimeout(() => {
      this.setState({autocompleteClose: false});
    }, 200);
  }

  handleChipInputBlur = () => {
    // To prevent close autocomplete will fire chip input blur
    if (this.state.autocompleteClose) return;
    this.setState({
      onChipInput: false,
    }, this.props.onChipEditing(false));
  }

  handleSampleButton = () => {
    const shuffled = this.props.dataSource.sort(() => .5 - Math.random()).slice(0, 8);
    this.setState({ entityChips: shuffled })
  }

  render() {
    const {
      entityChips,
      openSnackbar,
      onChipInput,
    } = this.state;
    let chipRenderer = ({ value, isFocused, isDisabled, handleClick, handleRequestDelete, defaultStyle }, key) => (
      <Chip
        key={key}
        onRequestDelete={() => this.handleChipDeleteRequest(value, null)}
        style={{ ...defaultStyle, pointerEvents: isDisabled ? 'none' : undefined, borderRadius: 2 }}
        backgroundColor={isFocused ? '#666666': '#fff'}>
        {value}
      </Chip>
    );
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: this.props.height,
        marginLeft: 4,
        paddingLeft: 4,
        marginRight: 4,
        backgroundColor: (onChipInput || entityChips.length) ? 'rgba(0, 0, 0, 0.07)' : null
      }}>
        <ChipInput
          value={entityChips}
          dataSource={this.props.dataSource}
          onFocus={this.handleChipInputFocus}
          onClose={this.handleAutocompleteOnClose}
          onBlur={this.handleChipInputBlur}
          onRequestAdd={this.handleChipAddRequest}
          onRequestDelete={this.handleChipDeleteRequest}
          openOnFocus={true}
          hintText={!onChipInput ? 'Specific Entities (Optional)' : null}
          disabled={this.props.disabled || false}
          style={{ height: this.props.height }}
          chipContainerStyle={{ overflow: 'auto', maxHeight: 64 }}
          openOnFocus={true}
          underlineShow={entityChips.length === 0}
          chipRenderer={chipRenderer}
        />
        <Tooltip
          placement={'top'}
          trigger={['hover']}
          overlay={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 32, width: 180 }}>
              Choose Random Sample Entities
            </div>
          }
          align={{offset: [0, -2]}}
        >
          <ActionExploreIcon style={{color: '#9E9E9E', marginRight: 4}} onClick={this.handleSampleButton}/>
        </Tooltip>
        <Snackbar
          open={this.state.openSnackbar}
          message="Invalid entity cannot be added."
          autoHideDuration={3000}
          onRequestClose={() => this.setState({openSnackbar: false})}
        />
      </div>
    )
  }

}
