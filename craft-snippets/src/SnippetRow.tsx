import * as React from "react"
import styled, { createGlobalStyle } from "styled-components";
import { BlockSnippet } from "./Types";
import { niceTimeAgo } from "./Utils";
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem } from 'rc-menu';
import 'rc-dropdown/assets/index.css';
import { Colors } from "./Colors";

interface SnippetRowProps {
  isDarkMode: boolean;
  snippet: BlockSnippet;
  startAsEdited: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

export const DropdownDarkStyles = createGlobalStyle`
  html.dark .rc-dropdown-menu {
    background-color: #333333;
    box-shadow: 0 1px 5px #000;
    border: 1px solid #444444;
  }
  
  html.dark .rc-dropdown-menu-item-active {
    background-color: #444455 !important;
  }
`;

export const SnippetRow: React.FC<SnippetRowProps> = (props) => {
  const { isDarkMode, snippet } = props;
  const [isEdited, setIsEdited] = React.useState<boolean>(props.startAsEdited);

  const exitEditing = React.useCallback(() => {
    setIsEdited(false);
  }, [setIsEdited]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useLayoutEffect(() => {
    if (isEdited && inputRef.current != null) {
      inputRef.current.value = snippet.name;
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEdited, snippet.name]);

  const onMenuClick = React.useCallback(({key}) => {
    switch (key) {
      case "rename":
        setIsEdited(true);
        break
      case "delete":
        props.onDelete();
        break
    }
  }, [props.onDelete]);

  const onUpdate = React.useCallback(() => {
    const newName = inputRef.current?.value;
    if (newName != null) {
      props.onRename(newName);
    }
    setIsEdited(false);
  }, [props.onRename]);

  const normalMenuItemColor = Colors.text(isDarkMode, 0.9);
  const destructiveMenuItemColor = Colors.error(isDarkMode, 0.9);
  const menu = (
    <Menu onClick={onMenuClick} selectable={false}>
      <MenuItem key="rename">
        <MenuItemRow textColor={normalMenuItemColor}>
          <RenameIcon width={28} />
          <GapX w={4} />
          Rename
        </MenuItemRow>
      </MenuItem>
      <MenuItem key="delete">
        <MenuItemRow textColor={destructiveMenuItemColor}>
          <DeleteIcon width={28} />
          <GapX w={4} />
          Delete
        </MenuItemRow>
      </MenuItem>
    </Menu>
  );

  const previewSvgString = React.useMemo(() => {
    return craft.experimental.renderSmallBlockPreview(snippet.name, snippet.blocks, isDarkMode);
  }, [snippet, isDarkMode])

  return <SnippetContainer>
    <SnippetPreview onClick={props.onClick}>
      <div
        dangerouslySetInnerHTML={{__html: previewSvgString}}
      />
    </SnippetPreview>
    <GapX w={12} />
    <SnippetTitlePart onClick={props.onClick}>
      <FlexColumn>
        {!isEdited && 
          <TruncateToEllipsis>
            <Title color={Colors.text(isDarkMode)}>{snippet.name}</Title>
          </TruncateToEllipsis>
        }
        {isEdited && <NameInputBox ref={inputRef}
          isDarkMode={isDarkMode}
          updateCallback={onUpdate}
          exitCallback={exitEditing}
        />}
        <TruncateToEllipsis>
          <Subtitle color={Colors.text(isDarkMode)}>
            Saved {niceTimeAgo(snippet.createdMs, true)}
          </Subtitle>
        </TruncateToEllipsis>
      </FlexColumn>
    </SnippetTitlePart>
    <Dropdown
      trigger={['click']}
      overlay={menu}
      animation="slide-up"
    >
      <div>
        <ThreeDotsIcon width={20} color={Colors.text(isDarkMode)}/>
      </div>
    </Dropdown>
  </SnippetContainer>;
};

interface InputBoxProps {
  isDarkMode: boolean;
  updateCallback: () => void;
  exitCallback: () => void;
}

const NameInputBox = React.forwardRef<HTMLInputElement, InputBoxProps>((props, ref) => {
  const { isDarkMode, updateCallback, exitCallback } = props;
  const borderColor = Colors.text(!isDarkMode, 0.05);
  const bgColor = Colors.text(isDarkMode, 0.03);
  const placeholderColor = Colors.text(isDarkMode, 0.5);

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13))) {
      e.preventDefault();
      updateCallback();
    } else if (((e.which === 27) || (e.keyCode === 27))) {
      exitCallback();
    }
  }

  return <InputOuterBox bgColor={bgColor} borderColor={borderColor} onClick={(e) => e.stopPropagation()}>
    <NameInput ref={ref}
      placeholder={"Name your snippet..."}
      placeholderColor={placeholderColor}
      textColor={Colors.text(isDarkMode)}
      onKeyDown={onKeyPress}
      onBlur={updateCallback}
    />
  </InputOuterBox>;
});

const SnippetContainer = styled.div`
  display: flex;
  border-radius: 6px;
  margin: 0px 2px;
  padding: 8px 10px;
  /* min-width to allow grow up to container from 0 size */
  min-width: 0px;
  align-items: flex-start;
  cursor: pointer;  
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03), 0 0 1px rgba(0, 0, 0, 0.2);
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.2);
  }
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  /* min-width to allow grow up to container from 0 size */
  min-height: 0px;
  align-items: "flex-start";
`;

const SnippetTitlePart = styled.div`
  flex-Grow: 1;
  min-width: 0px;
  align-self: stretch;
  overflow: hidden;
`;

const Title = styled.div<{color: string}>`
  width: 100%;
  color: ${props => props.color};
  font-size: 15px;
  font-weight: 500;
  font-style: normal;
  font-family: Roboto,-apple-system,BlinkMacSystemFont,sans-serif;
  display: inline;
  line-height: 1.2;
`;

const Subtitle = styled.div<{color: string}>`
  width: 100%;
  color: ${props => props.color};
  opacity: 0.5;
  font-size: 12px;
  font-weight: 400;
  font-style: normal;
  display: inline;
  line-height: 1.2;
`;

const SnippetPreview = styled.div`
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  min-width: 30px;
  padding-top: 0px;
`;

const TruncateToEllipsis = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

interface AssetProps {
  width: number;
  color?: string;
  className?: string; // forwarded for styled component support
}

const ThreeDotsIcon: React.FC<AssetProps> = (props) => {
  const fillColor = props.color || "currentColor";
  return <svg {...mixSvgAttributes(props)} viewBox="0 0 28 28">
      <g id="BlockDetails.SideBar.MainActions.More" stroke="none" strokeWidth="1" fill={fillColor} fillRule="evenodd">
          <path d="M8.73,15.27 C9.03,15.27 9.29,15.20 9.53,15.05 C9.77,14.91 9.95,14.73 10.10,14.49 C10.24,14.26 10.31,14.00 10.31,13.71 C10.31,13.28 10.16,12.91 9.85,12.61 C9.55,12.31 9.18,12.16 8.73,12.16 C8.45,12.16 8.19,12.23 7.95,12.37 C7.72,12.51 7.53,12.70 7.39,12.93 C7.25,13.17 7.18,13.43 7.18,13.71 C7.18,14.00 7.25,14.26 7.39,14.49 C7.53,14.73 7.72,14.91 7.95,15.05 C8.19,15.20 8.45,15.27 8.73,15.27 Z M14.21,15.27 C14.50,15.27 14.76,15.20 14.99,15.05 C15.22,14.91 15.41,14.73 15.55,14.49 C15.69,14.26 15.77,14.00 15.77,13.71 C15.77,13.28 15.61,12.91 15.31,12.61 C15.01,12.31 14.65,12.16 14.21,12.16 C13.93,12.16 13.67,12.23 13.43,12.37 C13.20,12.51 13.01,12.70 12.87,12.93 C12.73,13.17 12.66,13.43 12.66,13.71 C12.66,14.00 12.73,14.26 12.87,14.49 C13.01,14.73 13.20,14.91 13.43,15.05 C13.67,15.20 13.93,15.27 14.21,15.27 Z M19.68,15.27 C19.97,15.27 20.23,15.20 20.46,15.05 C20.70,14.91 20.89,14.73 21.03,14.49 C21.17,14.26 21.24,14.00 21.24,13.71 C21.24,13.28 21.09,12.91 20.79,12.61 C20.49,12.31 20.12,12.16 19.68,12.16 C19.40,12.16 19.13,12.23 18.90,12.37 C18.66,12.51 18.47,12.70 18.33,12.93 C18.19,13.17 18.12,13.43 18.12,13.71 C18.12,14.00 18.19,14.26 18.33,14.49 C18.47,14.73 18.66,14.91 18.90,15.05 C19.13,15.20 19.40,15.27 19.68,15.27 Z" />
      </g>
  </svg>;
};

function mixSvgAttributes(props: {width: number; className?: string}, additionalClassName?: string): Pick<React.SVGAttributes<SVGSVGElement>, "className" | "width" | "version" | "xmlns" | "xmlnsXlink"> {
  return {
    className: [props.className, additionalClassName].filter(cn => cn != null).join(" "),
    width: props.width,
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink"
  };
}

const NameInput = styled.input<{placeholderColor: string, textColor: string}>`
  font-family: inherit;
  font-size: 14px;
  height: 18px;
  width: 100%;
  padding-left: 1px;
  padding-right: 1px;
  font-weight: 400;
  color: ${props => props.textColor};
  box-sizing: border-box;
  border: none;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${props => props.placeholderColor};
  }
  -webkit-tap-highlight-color: transparent;
  align-self: center;
  background-color: transparent;
  flex-grow: 1;
`;

const InputOuterBox = styled.div<{bgColor: string; borderColor: string}>`
  position: relative;
  width: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  background-color: ${props => props.bgColor};
  box-sizing: border-box;
  `;

const MenuItemRow = styled.div<{textColor: string}>`
  display: flex;
  align-items: center;
  padding-right: 6px;
  color: ${props => props.textColor};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`;

const RenameIcon: React.FC<AssetProps> = (props) => {
  const fillColor = props.color || "currentColor";
  return <svg {...mixSvgAttributes(props)} viewBox="0 0 28 28">
      <g id="Sidebar.Rename" stroke="none" strokeWidth="1" fill={fillColor} fillRule="evenodd">
        <path d="M19.78,20.00 C20.08,20.00 20.23,19.88 20.23,19.63 C20.23,19.38 20.08,19.26 19.78,19.26 L18.36,19.26 L18.36,7.52 L19.78,7.52 C20.08,7.52 20.23,7.40 20.23,7.15 C20.23,6.91 20.08,6.79 19.78,6.79 L16.08,6.79 C15.79,6.79 15.64,6.91 15.64,7.15 C15.64,7.40 15.79,7.52 16.08,7.52 L17.51,7.52 L17.51,19.26 L16.08,19.26 C15.79,19.26 15.64,19.38 15.64,19.63 C15.64,19.88 15.79,20.00 16.08,20.00 L19.78,20.00 Z M11.56,18.10 C11.74,18.10 11.88,18.04 11.99,17.93 C12.10,17.83 12.15,17.68 12.15,17.50 L12.15,9.94 L14.73,9.94 C14.89,9.94 15.02,9.89 15.13,9.79 C15.23,9.70 15.28,9.57 15.28,9.41 C15.28,9.25 15.23,9.12 15.13,9.02 C15.02,8.92 14.89,8.87 14.73,8.87 L8.39,8.87 C8.22,8.87 8.09,8.92 7.99,9.02 C7.89,9.12 7.84,9.25 7.84,9.41 C7.84,9.57 7.89,9.70 7.99,9.79 C8.09,9.89 8.22,9.94 8.39,9.94 L10.97,9.94 L10.97,17.50 C10.97,17.68 11.02,17.83 11.13,17.93 C11.23,18.04 11.38,18.10 11.56,18.10 Z" />
      </g>
  </svg>;
};

const DeleteIcon: React.FC<AssetProps> = (props) => {
  const fillColor = props.color || "currentColor";
  return <svg {...mixSvgAttributes(props)} viewBox="0 0 28 28">
      <g id="Sidebar.Delete" stroke="none" strokeWidth="1" fill={fillColor} fillRule="evenodd">
        <path d="M17.44,19.92 C17.90,19.92 18.27,19.78 18.55,19.51 C18.83,19.24 18.98,18.88 19.01,18.42 L19.44,9.19 L20.20,9.19 C20.34,9.19 20.45,9.14 20.54,9.05 C20.63,8.95 20.68,8.84 20.68,8.71 C20.68,8.58 20.63,8.47 20.54,8.37 C20.45,8.28 20.34,8.23 20.20,8.23 L17.30,8.23 L17.30,7.26 C17.30,6.80 17.16,6.44 16.88,6.18 C16.61,5.91 16.22,5.78 15.73,5.78 L13.32,5.78 C12.83,5.78 12.45,5.91 12.17,6.18 C11.89,6.44 11.75,6.80 11.75,7.26 L11.75,8.23 L8.86,8.23 C8.73,8.23 8.62,8.28 8.53,8.38 C8.43,8.47 8.39,8.58 8.39,8.71 C8.39,8.84 8.43,8.95 8.53,9.05 C8.62,9.14 8.73,9.19 8.86,9.19 L9.62,9.19 L10.06,18.43 C10.08,18.88 10.23,19.25 10.52,19.52 C10.80,19.78 11.17,19.92 11.62,19.92 L17.44,19.92 Z M16.29,8.23 L12.76,8.23 L12.76,7.32 C12.76,7.15 12.82,7.00 12.93,6.89 C13.04,6.78 13.20,6.73 13.39,6.73 L15.67,6.73 C15.86,6.73 16.01,6.78 16.12,6.89 C16.24,7.00 16.29,7.15 16.29,7.32 L16.29,8.23 Z M17.34,18.96 L11.71,18.96 C11.53,18.96 11.38,18.90 11.26,18.78 C11.13,18.65 11.07,18.50 11.06,18.31 L10.61,9.19 L18.42,9.19 L18.01,18.31 C18.00,18.50 17.93,18.66 17.81,18.78 C17.68,18.90 17.53,18.96 17.34,18.96 Z M12.65,17.87 C12.77,17.87 12.87,17.84 12.94,17.77 C13.01,17.70 13.05,17.61 13.04,17.50 L12.85,10.71 C12.85,10.60 12.81,10.51 12.74,10.44 C12.66,10.37 12.57,10.34 12.45,10.34 C12.34,10.34 12.24,10.37 12.17,10.44 C12.10,10.51 12.06,10.60 12.06,10.71 L12.26,17.50 C12.26,17.61 12.29,17.71 12.37,17.77 C12.44,17.84 12.54,17.87 12.65,17.87 Z M14.54,17.87 C14.65,17.87 14.75,17.84 14.83,17.77 C14.90,17.70 14.94,17.61 14.94,17.50 L14.94,10.71 C14.94,10.60 14.90,10.51 14.83,10.44 C14.75,10.37 14.65,10.34 14.54,10.34 C14.41,10.34 14.31,10.37 14.24,10.44 C14.16,10.51 14.12,10.60 14.12,10.71 L14.12,17.50 C14.12,17.61 14.16,17.70 14.24,17.77 C14.31,17.84 14.41,17.87 14.54,17.87 Z M16.42,17.87 C16.53,17.87 16.62,17.84 16.70,17.77 C16.77,17.71 16.81,17.61 16.81,17.50 L17.01,10.71 C17.01,10.60 16.97,10.51 16.90,10.44 C16.83,10.37 16.73,10.34 16.61,10.34 C16.50,10.34 16.40,10.37 16.33,10.44 C16.26,10.51 16.22,10.60 16.21,10.71 L16.02,17.50 C16.02,17.61 16.05,17.70 16.12,17.77 C16.20,17.84 16.29,17.87 16.42,17.87 Z" />
      </g>
  </svg>;
};

const GapX = styled.div<{w: number}>`
  max-width: ${props => props.w}px;
  min-width: ${props => props.w}px;
`;
