import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../assets/logo.png';
import PropTypes from 'prop-types';
import { bgDefault, bgHover, bgActive, textDefault, textHover, textActive, logoColor, btnBg, btnBgActive } from './theme';

const routes = [
    { title: 'Home', icon: 'fas-solid fa-house', path: '/' },
    { title: 'Sales', icon: 'chart-line', path: '/sales' },
    { title: 'Costs', icon: 'chart-column', path: '/costs' },
    { title: 'Payments', icon: 'wallet', path: '/payments' },
    { title: 'Finances', icon: 'chart-pie', path: '/finances' },
    { title: 'Messages', icon: 'envelope', path: '/messages' },
];

const bottomRoutes = [
    { title: 'Settings', icon: 'sliders', path: '/settings' },
    { title: 'Support', icon: 'phone-volume', path: '/support' },
];

const Sidebar = ({ color = "light" }) => {
    const [isOpened, setIsOpened] = useState(true);
    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem('themeMode') || color;
    });
    const [activePath, setActivePath] = useState(() => {
        return localStorage.getItem('activePath') || '/';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', themeMode);
        document.documentElement.style.backgroundColor = btnBgActive(themeMode)
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode]);

    const goToRoute = (path) => {
        setActivePath(path);
        localStorage.setItem('activePath', path);
        console.log(`going to "${path}"`);
    };

    const toggleSidebar = () => {
        setIsOpened(v => !v);
    };
    const toggleTheme = () => setThemeMode(m => (m === 'light' ? 'dark' : 'light'));

    return (
        <Wrap $opened={isOpened} $mode={themeMode}>
            <Top $mode={themeMode} $opened={isOpened}>
                <img src={logo} alt="TensorFlow logo" />
                <Label $opened={isOpened} $mode={themeMode}>TensorFlow</Label>
                <Reveal aria-label={isOpened ? 'SHRINK' : 'EXPAND'} $opened={isOpened} $mode={themeMode} onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={isOpened ? 'angle-left' : 'angle-right'} />
                </Reveal>
            </Top>

            <Items>
                {routes.map(route => (
                    <Item
                        $opened={isOpened}
                        $title={route.title}
                        $active={activePath === route.path}
                        $mode={themeMode}
                        key={route.title}
                        onClick={() => goToRoute(route.path)}
                    >
                        <FontAwesomeIcon icon={route.icon} />
                        <Label $opened={isOpened} $mode={themeMode}>{route.title}</Label>
                    </Item>
                ))}
            </Items>

            <Bottom>
                <ThemeBtn $mode={themeMode}>
                    <Label $opened={isOpened} $mode={themeMode}>Change theme</Label>
                    <input
                        id="toggle"
                        hidden
                        type="checkbox"
                        checked={themeMode === "dark"}
                        onChange={toggleTheme}
                        aria-label="Switch theme"
                    />
                    <Track $mode={themeMode} htmlFor="toggle" data-checked={themeMode === "dark"}>
                        <Thumb data-checked={themeMode === "dark"} />
                    </Track>
                </ThemeBtn>

                <Items>
                    {bottomRoutes.map(route => (
                        <Item
                            $opened={isOpened}
                            $title={route.title}
                            $active={activePath === route.path}
                            $mode={themeMode}
                            key={route.title}
                            onClick={() => goToRoute(route.path)}
                        >
                            <FontAwesomeIcon icon={route.icon} />
                            <Label $opened={isOpened} $mode={themeMode}>{route.title}</Label>
                        </Item>
                    ))}
                </Items>
            </Bottom>
        </Wrap>
    );
};

Sidebar.propTypes = {
    color: PropTypes.string,
};

export default Sidebar;


const Wrap = styled.aside`
    display: flex;
    flex-direction: column;
    background-color: ${({ $mode }) => bgDefault($mode)};
    width: ${({ $opened }) => ($opened ? "200px" : "60px")};
    padding: 20px;
    gap: 40px;
    border-radius: 20px;
    transition:
        width 0.3s ease,
        background-color 0.3s ease;
`;

const Top = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0px 5px;
    img {
        width: 30px;
        height: 30px; 
        display: block; 
        border-radius: 6px;  
        transform: translateX(${({ $opened }) => ($opened ? "0" : "10px")});
        transition: 0.3s;
    }

    span {
        color: ${({ $mode }) => logoColor($mode)}
    }
`;

const Reveal = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({ $opened }) => $opened ? "-30px" : "-60px"};
    border-radius: 50%;
    background-color: ${({ $mode, $opened }) => $opened ? btnBgActive($mode) : btnBg($mode)};
    color: ${({ $mode }) => textDefault($mode)};
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.3s;

     &::after {
    content: attr(aria-label);
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translate(-10px, -50%);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 2px;
    border-radius: 8px;
    color: ${({ $mode }) => textHover($mode)};
    white-space: nowrap;
    opacity: 0;
    max-width: 0;
    overflow: hidden;
    pointer-events: none;

    transition:
      opacity .5s ease,
      max-width .25s ease,
      transform .25s ease;
  }

    &:hover::after {
      opacity: 1;
      max-width: 160px;
      transform: translate(10%, -50%);
    }
  }
`;

const Items = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Item = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 10px;
    cursor: pointer;
    border-radius: 10px;
    transition: background-color 0.3s ease, color 0.3s ease;
    color: ${({ $mode, $active }) =>
        $active ? textActive($mode) : textDefault($mode)};
    background: ${({ $mode, $active }) =>
        $active ? bgActive($mode) : "transparent"};

    
    &:hover {
        background: ${({ $mode }) => bgActive($mode)};
        color: ${({ $mode }) => textHover($mode)};
    }

    svg {
        transform: translateX(${({ $opened }) => ($opened ? "0" : "10px")});
        transition: 0.3s;
        }

     &:hover::after {
        content: "${({ $title }) => $title}";
        position: absolute;
        left: calc(100% + 5px);
        top: 50%;
        transform: translateY(-50%);
        margin-left: 8px;
        padding: 4px 8px;
        background: ${({ $mode }) => logoColor($mode)};
        color: var(--color-sidebar-background-light-active);
        border-radius: 6px;
        white-space: nowrap;
        font-size: 14px;
        font-weight: 500;
        opacity: ${({ $opened }) => ($opened ? 0 : 1)};
        pointer-events: none;
        transition: 0.3s;
    }
`;

const Label = styled.span`
    white-space: nowrap;
    overflow: hidden;
    max-width: ${({ $opened }) => ($opened ? '180px' : '0')};
    opacity: ${({ $opened }) => ($opened ? 1 : 0)};
    transform: translateX(${({ $opened }) => ($opened ? '0' : '-20px')});
    transition:
        max-width 0.25s  ${({ $opened }) => ($opened ? '.12s' : '0s')},
        opacity 0.18s  ${({ $opened }) => ($opened ? '.12s' : '0s')},
        transform 0.18s  ${({ $opened }) => ($opened ? '.12s' : '0s')},
        color 0.3s;
    color: ${({ $mode }) => textHover($mode)};
    font-weight: 500;
`;

const Bottom = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ThemeBtn = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background: ${({ $mode }) => bgHover($mode)};
    border-radius: 10px;
    transition: background-color 0.3s ease;
`;

const Track = styled.label`
  --track-w: 42px;
  --track-h: 24px;
  position: relative;
  width: var(--track-w);
  height: var(--track-h);
  border-radius: 999px;
  cursor: pointer;
  display: inline-block;
  background: ${({ $mode }) => btnBgActive($mode)};
  transition: background-color .2s ease, border-color .2s ease;
`;

const Thumb = styled.span`
  --thumb: 18px;
  position: absolute;
  top: 50%;
  left: 3px;
  width: var(--thumb);
  height: var(--thumb);
  border-radius: 50%;
  background: #fff;
  transform: translate(0, -50%);
  transition: transform .2s ease;
  &[data-checked="true"] {
    transform: translate(calc(42px - 3px - var(--thumb)), -50%);
  }
`;
