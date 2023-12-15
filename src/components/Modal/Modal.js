import React, { useEffect, useState } from "react";
import * as cryptography from "@liskhq/lisk-cryptography";
import "./Modal.css";
import { useWalletConnect } from "../../context/WalletConnectProvider";
import QRCode from "react-qr-code";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { getSystemTheme } from "../../utils/Theme/getSystemTheme";
import Loader from "../Loader";
import Avatar from "../Avatar";
import { addressCompact } from "../../utils/Address";
import { useTheme } from "../../context/ThemeProvider";
import { useWalletModal } from "../../context/WalletModal";

const Modal = () => {
  const { senderPublicKey, wcUri, disconnect } = useWalletConnect();
  const [isModalOpen, setIsModalOpen] = useWalletModal();

  const [wcCopied, setWCRequestCopied] = useState(false);
  const [addressCopied, setAddressRequestCopied] = useState(false);
  const [hoverClose, setHoverClose] = useState(true);
  const [hoverAddress, setHoverAddress] = useState(true);
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const [currentTheme, setCurrentTheme] = useTheme();
  const [theme, setTheme] = useState(currentTheme);

  useEffect(() => {
    currentTheme === "system"
      ? setTheme(getSystemTheme())
      : setTheme(currentTheme);
  }, [currentTheme]);

  const handleWCRequestCopied = React.useCallback(() => {
    setWCRequestCopied(true);
    setTimeout(() => setWCRequestCopied(false), 2000);
  }, []);

  const handleAddressCopied = React.useCallback(() => {
    setAddressRequestCopied(true);
    setTimeout(() => setAddressRequestCopied(false), 1000);
  }, []);

  const handleButtonClick = React.useCallback(() => {
    setSecondModalOpen(true);
  }, []);

  const handleSunClick = React.useCallback(() => {
    setCurrentTheme("light");
  }, [setCurrentTheme]);

  const handleMoonClick = React.useCallback(() => {
    setCurrentTheme("dark");
  }, [setCurrentTheme]);

  const handleAutoTheme = React.useCallback(() => {
    setCurrentTheme("system");
  }, [setCurrentTheme]);

  const handleCloseAccountDrawer = React.useCallback(() => {
    setIsModalOpen(false);
    setSecondModalOpen(false);
  }, [setIsModalOpen]);

  const handleDisconnect = React.useCallback(async () => {
    setIsDisconnecting(true);
    await disconnect();
    handleCloseAccountDrawer();
    setIsDisconnecting(false);
  }, [disconnect, handleCloseAccountDrawer]);

  return (
    <>
      <div className={`sc-3dvm1v-2 dLsVJq ${isModalOpen ? "open" : ""}`}>
        <div
          data-testid="close-account-drawer"
          className={`sc-3dvm1v-5 hVzdzS`}
          style={{
            backgroundColor: hoverClose
              ? theme === "light"
                ? "#00000005"
                : "#FFFFFF05"
              : undefined,
          }}
          onMouseEnter={() => setHoverClose(true)}
          onMouseLeave={() => setHoverClose(false)}
          onClick={handleCloseAccountDrawer}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sc-3dvm1v-4 jEKWjE"
          >
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
        </div>

        <div className={`sc-3dvm1v-0 eTxptr `}></div>
        <div className={`sc-3dvm1v-3 hyeENl`}>
          <div
            id="wallet-dropdown-scroll-wrapper"
            className="sc-3dvm1v-1 fijsNj"
          >
            <div className="sc-1kykgp9-0 sc-11yue4p-0 iCxowP kfarYJ">
              {isModalOpen && (
                <div data-testid="wallet-modal" className="sc-1hmbv05-0 jcIclM">
                  <div
                    width="100%"
                    className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 laNPNA fsgYBU NRTGQ"
                  >
                    {senderPublicKey ? (
                      <CopyToClipboard
                        text={cryptography.address.getLisk32AddressFromPublicKey(
                          Buffer.from(senderPublicKey, "hex")
                        )}
                        onCopy={handleAddressCopied}
                        onMouseEnter={() => setHoverAddress(true)}
                        onMouseLeave={() => setHoverAddress(false)}
                      >
                        <div style={{ display: "flex", cursor: "pointer" }}>
                          <Avatar
                            size={30}
                            address={cryptography.address.getLisk32AddressFromPublicKey(
                              Buffer.from(senderPublicKey, "hex")
                            )}
                          />
                          <p
                            className="text"
                            style={{
                              marginTop: "auto",
                              marginBottom: "auto",
                              marginLeft: "8px",
                              fontSize: "12px",
                            }}
                          >
                            {addressCompact(
                              cryptography.address.getLisk32AddressFromPublicKey(
                                Buffer.from(senderPublicKey, "hex")
                              )
                            )}
                          </p>
                          {hoverAddress ? (
                            <div
                              style={{
                                marginTop: "auto",
                                marginBottom: "auto",
                                marginLeft: "8px",
                              }}
                            >
                              {addressCopied ? (
                                <svg
                                  width="14px"
                                  height="14px"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                >
                                  <path
                                    fill={
                                      theme === "light" ? "#000000" : "#7f9bd4"
                                    }
                                    fillRule="evenodd"
                                    d="M3 10a7 7 0 019.307-6.611 1 1 0 00.658-1.889 9 9 0 105.98 7.501 1 1 0 00-1.988.22A7 7 0 113 10zm14.75-5.338a1 1 0 00-1.5-1.324l-6.435 7.28-3.183-2.593a1 1 0 00-1.264 1.55l3.929 3.2a1 1 0 001.38-.113l7.072-8z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_5_1870)">
                                    <path
                                      d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z"
                                      stroke={
                                        theme === "light"
                                          ? "#000000"
                                          : "#7f9bd4"
                                      }
                                      strokeWidth="1.3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                    <path
                                      d="M3.33398 10.0007H2.66732C2.3137 10.0007 1.97456 9.86017 1.72451 9.61013C1.47446 9.36008 1.33398 9.02094 1.33398 8.66732V2.66732C1.33398 2.3137 1.47446 1.97456 1.72451 1.72451C1.97456 1.47446 2.3137 1.33398 2.66732 1.33398H8.66732C9.02094 1.33398 9.36008 1.47446 9.61013 1.72451C9.86017 1.97456 10.0007 2.3137 10.0007 2.66732V3.33398"
                                      stroke={
                                        theme === "light"
                                          ? "#000000"
                                          : "#7f9bd4"
                                      }
                                      strokeWidth="1.3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_5_1870">
                                      <rect
                                        width="16"
                                        height="16"
                                        fill="white"
                                      ></rect>
                                    </clipPath>
                                  </defs>
                                </svg>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </CopyToClipboard>
                    ) : (
                      <div className="sc-sx9n2y-0 kivXvb css-rjqmed">
                        Connect a wallet
                      </div>
                    )}
                    <div style={{ display: "flex" }}>
                      <button
                        data-testid="wallet-settings"
                        className="sc-u2uow0-2 kIafUC"
                        onClick={handleButtonClick}
                      >
                        <span className="sc-u2uow0-3 bLwPSk">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx={12} cy={12} r={3} />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                          </svg>
                        </span>
                      </button>
                      {senderPublicKey ? (
                        <button
                          data-testid="wallet-settings"
                          className="sc-u2uow0-2 kIafUC"
                          onClick={handleDisconnect}
                          style={{ marginLeft: "8px" }}
                        >
                          <span className="sc-u2uow0-3 bLwPSk">
                            {isDisconnecting ? (
                              <Loader size={14} theme={currentTheme} />
                            ) : (
                              <svg
                                width="14px"
                                height="14px"
                                viewBox="0 -0.5 21 21"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g
                                  id="Page-1"
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <g
                                    id="Dribbble-Light-Preview"
                                    transform="translate(-419.000000, -560.000000)"
                                    fill="#000000"
                                  >
                                    <g
                                      id="icons"
                                      transform="translate(56.000000, 160.000000)"
                                    >
                                      <path
                                        d="M378.381271,401.145 C377.596921,400.752 376.64982,401.278 376.64982,402.123 C376.64982,402.552 376.91862,402.925 377.316571,403.126 C380.236622,404.602 382.110873,407.716 381.575372,411.174 C381.046172,414.602 378.050521,417.343 374.434319,417.728 C369.515067,418.251 365.333966,414.581 365.333966,410 C365.333966,407.004 367.121066,404.4 369.733467,403.101 C370.102018,402.918 370.349818,402.572 370.349818,402.176 L370.349818,402.084 C370.349818,401.256 369.423717,400.745 368.651967,401.129 C364.951765,402.966 362.545164,406.841 363.072265,411.191 C363.624565,415.742 367.515866,419.43 372.296519,419.936 C378.634321,420.607 383.999823,415.9 383.999823,410 C383.999823,406.155 381.722372,402.818 378.381271,401.145 M372.449819,409 L372.449819,401 C372.449819,400.447 372.920219,400 373.499819,400 C374.080469,400 374.549819,400.447 374.549819,401 L374.549819,409 C374.549819,409.552 374.080469,410 373.499819,410 C372.920219,410 372.449819,409.552 372.449819,409"
                                        id="shut_down-[#1431]"
                                      ></path>
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            )}
                          </span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="sc-1kykgp9-2 kqzAOQ">
                    <div>
                      <div className="sc-1hmbv05-2 ilYVNX">
                        <div className="sc-sx9n2y-0 bftkTM css-4u0e4f">
                          Scan the QR code using{" "}
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://lisk.com/wallet"
                            className="sc-7yzmni-9 jnMVFjj sc-m8pibl-0 eBkKRJ"
                          >
                            Lisk Mobile{" "}
                          </a>{" "}
                          or copy the request string and paste it into your{" "}
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="lisk://"
                            className="sc-7yzmni-9 jnMVFjj sc-m8pibl-0 eBkKRJ"
                          >
                            Lisk Desktop{" "}
                          </a>{" "}
                          wallet (under Applications {">"} Wallet connections{" "}
                          {">"}
                          Connect Wallet)
                        </div>
                      </div>

                      <div style={{ height: "16px" }} />

                      <div
                        data-testid="option-grid"
                        className="sc-1hmbv05-1 hmenal"
                      >
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {wcUri ? (
                            <div>
                              <div
                                style={{
                                  background: "white",
                                  padding: "8px",
                                }}
                              >
                                <QRCode
                                  value={wcUri}
                                  style={{ width: "100%" }}
                                />
                              </div>

                              <div style={{ height: "16px" }} />

                              <CopyToClipboard
                                text={wcUri}
                                onCopy={handleWCRequestCopied}
                              >
                                {wcCopied ? (
                                  <div
                                    className="sc-7yzmni-9 jnMVFjj sc-m8pibl-0 eBkKRJ"
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <p
                                      style={{
                                        marginTop: "auto",
                                        marginBottom: "auto",
                                        fontSize: "14px",
                                      }}
                                    >
                                      Request Copied
                                    </p>
                                  </div>
                                ) : (
                                  <div
                                    className="sc-7yzmni-9 jnMVFjj sc-m8pibl-0 eBkKRJ"
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g clipPath="url(#clip0_5_1870)">
                                        <path
                                          d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z"
                                          stroke="currentColor"
                                          strokeWidth="1.3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        ></path>
                                        <path
                                          d="M3.33398 10.0007H2.66732C2.3137 10.0007 1.97456 9.86017 1.72451 9.61013C1.47446 9.36008 1.33398 9.02094 1.33398 8.66732V2.66732C1.33398 2.3137 1.47446 1.97456 1.72451 1.72451C1.97456 1.47446 2.3137 1.33398 2.66732 1.33398H8.66732C9.02094 1.33398 9.36008 1.47446 9.61013 1.72451C9.86017 1.97456 10.0007 2.3137 10.0007 2.66732V3.33398"
                                          stroke="currentColor"
                                          strokeWidth="1.3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        ></path>
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_5_1870">
                                          <rect
                                            width="16"
                                            height="16"
                                            fill="white"
                                          ></rect>
                                        </clipPath>
                                      </defs>
                                    </svg>
                                    <p
                                      style={{
                                        marginTop: "auto",
                                        marginBottom: "auto",
                                        marginLeft: "8px",
                                        fontSize: "14px",
                                      }}
                                    >
                                      Copy Request
                                    </p>
                                  </div>
                                )}
                              </CopyToClipboard>

                              <div style={{ height: "24px" }} />

                              <div
                                className="sc-sx9n2y-0 bftkTM css-4u0e4f"
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Loader size={18} theme={currentTheme} />
                                <p
                                  style={{
                                    marginTop: "auto",
                                    marginBottom: "auto",
                                    marginLeft: "8px",
                                    fontSize: "14px",
                                  }}
                                >
                                  Awaiting Connection...
                                </p>
                              </div>
                            </div>
                          ) : (
                            <Loader size={40} theme={currentTheme} />
                          )}
                        </div>
                      </div>
                      {/* <div className="sc-1hmbv05-2 ilYVNX">
                      <div className="sc-sx9n2y-0 bftkTM css-4u0e4f">
                        By connecting a wallet, you agree to Uniswap Labs'{" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://uniswap.org/terms-of-service/"
                          className="sc-7yzmni-9 jnMVFjj sc-m8pibl-0 eBkKRJ"
                        >
                          Terms of Service{" "}
                        </a>
                        and consent to its{" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://uniswap.org/privacy-policy"
                          className="sc-7yzmni-9 jnMVFjj sc-m8pibl-0 eBkKRJ"
                        >
                          Privacy Policy.
                        </a>
                        <span className="sc-m8pibl-1 hqtSjX">
                          {" "}
                          (Last Updated 6.7.23)
                        </span>
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div>
              )}

              {isSecondModalOpen && (
                <div
                  className={`sc-3dvm1v-2 dLsVJq ${
                    isSecondModalOpen ? "open" : ""
                  }`}
                >
                  <div
                    data-testid="close-account-drawer"
                    className="sc-3dvm1v-5 hVzdzS"
                    onClick={handleCloseAccountDrawer}
                    style={{
                      backgroundColor: hoverClose
                        ? theme === "light"
                          ? "#00000005"
                          : "#FFFFFF05"
                        : undefined,
                    }}
                    onMouseEnter={() => setHoverClose(true)}
                    onMouseLeave={() => setHoverClose(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="sc-3dvm1v-4 jEKWjE"
                    >
                      <polyline points="13 17 18 12 13 7" />
                      <polyline points="6 17 11 12 6 7" />
                    </svg>
                  </div>
                  <div className="sc-3dvm1v-0 eTxptr" open="" />
                  <div className="sc-3dvm1v-3 hyeENl" open="">
                    <div
                      id="wallet-dropdown-scroll-wrapper"
                      className="sc-3dvm1v-1 fijsNj"
                    >
                      <div className="sc-1kykgp9-0 sc-11yue4p-0 iCxowP kfarYJ">
                        <div className="sc-1xe6nb0-0 cnmVKz">
                          <div className="sc-1xe6nb0-3 fjOrSN">
                            <i
                              className="back-arrow ri-arrow-left-line"
                              onClick={() => setSecondModalOpen(false)}
                            ></i>
                            <span className="sc-1xe6nb0-1 UbGpC">
                              <div className="sc-sx9n2y-0 kivXvb css-rjqmed">
                                Settings
                              </div>
                            </span>
                          </div>
                          <div className="sc-sx9n2y-0 kivXvb sc-k6pz4u-1 bepFek css-rjqmed">
                            Preferences
                          </div>
                          <div className="sc-k6pz4u-2 bqhmxH">
                            <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz1">
                              <div
                                width="40%"
                                className="sc-bczRLJ sc-nrd8cx-0 gxbXPT feIyWM"
                              >
                                <div className="sc-sx9n2y-0 kandXm css-1aekuku">
                                  Theme
                                </div>
                              </div>
                              <div
                                width="60%"
                                className="sc-bczRLJ sc-nrd8cx-0 foniQS jGtsjx"
                              >
                                <div className="sc-bczRLJ sc-nrd8cx-0 sc-1euncec-1 hJYFVB xyz1 etXiLa">
                                  <div
                                    data-testid="theme-auto"
                                    onClick={handleAutoTheme}
                                    className={`sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 sc-1euncec-0 hJYFVB xyz1 kHFzEX ${
                                      currentTheme === "system" ? "eqaHKd" : ""
                                    }`}
                                  >
                                    <div className="sc-sx9n2y-0 kandXm css-rjqmed">
                                      Auto
                                    </div>
                                  </div>
                                  <div
                                    data-testid="theme-lightmode"
                                    className={`sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 sc-1euncec-0 hJYFVB xyz1 kHFzEX ${
                                      currentTheme === "light" ? "eqaHKd" : ""
                                    }`}
                                    onClick={handleSunClick}
                                  >
                                    <i className="sun ri-sun-line"></i>
                                    <div className="sc-sx9n2y-0 kandXm css-rjqmed" />
                                  </div>
                                  <div
                                    data-testid="theme-darkmode"
                                    className={`sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 sc-1euncec-0 hJYFVB xyz1 kHFzEX ${
                                      currentTheme === "dark" ? "eqaHKd" : ""
                                    }`}
                                    onClick={handleMoonClick}
                                  >
                                    <i className="moon ri-moon-line"></i>

                                    <div className="sc-sx9n2y-0 kandXm css-rjqmed" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                              <div className="sc-1kykgp9-0 sc-1opkkz6-0 iCxowP kMuqSe">
                                <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                                  <div className="sc-sx9n2y-0 kivXvb css-1aekuku">
                                    Hide small balances
                                  </div>
                                </div>
                              </div>
                              <button
                                role="option"
                                aria-selected="true"
                                className="sc-1poje5t-0 jANAGB"
                              >
                                <span className="sc-1poje5t-1 jsjUXs" />
                              </button>
                            </div>
                            <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                              <div className="sc-1kykgp9-0 sc-1opkkz6-0 iCxowP kMuqSe">
                                <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                                  <div className="sc-sx9n2y-0 kivXvb css-1aekuku">
                                    Allow analytics
                                  </div>
                                </div>
                                <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                                  {/* <div className="bftkTM css-mx5ldy">
                                                                        We use anonymized data to enhance your experience with
                                                                        Uniswap Labs products.
                                                                    </div> */}
                                </div>
                              </div>
                              <button
                                role="option"
                                aria-selected="true"
                                className="sc-1poje5t-0 jANAGB"
                              >
                                <span className="sc-1poje5t-1 jsjUXs" />
                              </button>
                            </div>
                            <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                              <div className="sc-1kykgp9-0 sc-1opkkz6-0 iCxowP kMuqSe">
                                <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                                  <div className="sc-sx9n2y-0 kivXvb css-1aekuku">
                                    Show testnets
                                  </div>
                                </div>
                              </div>
                              <button
                                id="testnets-toggle"
                                data-testid="testnets-toggle"
                                role="option"
                                aria-selected="false"
                                className="sc-1poje5t-0 ffxhvk"
                              >
                                <span className="sc-1poje5t-1 bQBOQe" />
                              </button>
                            </div>
                          </div>
                          <div
                            data-testid="wallet-header"
                            className="sc-sx9n2y-0 kivXvb sc-k6pz4u-1 bepFek css-rjqmed"
                          >
                            Language
                          </div>

                          <a
                            className="sc-k6pz4u-0 iFDhEy"
                            href="#/nfts?lng=en-US"
                          >
                            <div
                              data-testid="wallet-language-item"
                              className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                            >
                              English
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={20}
                              height={20}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#4C82FB"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              opacity={1}
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </a>
                          {/* <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=en-US">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            English
                                                        </div>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={20}
                                                            height={20}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="#4C82FB"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            opacity={1}
                                                        >
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=af-ZA">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Afrikaans
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=ar-SA">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            العربية
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=ca-ES">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Català
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=cs-CZ">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            čeština
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=da-DK">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            dansk
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=de-DE">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Deutsch
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=el-GR">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            ελληνικά
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=es-ES">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Español
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=fi-FI">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            suomi
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=fr-FR">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            français
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=he-IL">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            עִברִית
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=hu-HU">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Magyar
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=id-ID">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            bahasa Indonesia
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=it-IT">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Italiano
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=ja-JP">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            日本語
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=ko-KR">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            한국어
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=nl-NL">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Nederlands
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=no-NO">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            norsk
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=pl-PL">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Polskie
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=pt-BR">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            português
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=pt-PT">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            português
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=ro-RO">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Română
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=ru-RU">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            русский
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=sr-SP">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Српски
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=sv-SE">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            svenska
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=sw-TZ">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Kiswahili
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=tr-TR">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Türkçe
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=uk-UA">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Український
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=vi-VN">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            Tiếng Việt
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=zh-CN">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            简体中文
                                                        </div>
                                                    </a>
                                                    <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=zh-TW">
                                                        <div
                                                            data-testid="wallet-language-item"
                                                            className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                                                        >
                                                            繁体中文
                                                        </div>
                                                    </a> */}
                          <div className="sc-1lgoclx-0 zoyEF">
                            <div className="sc-d5tbhs-1 cSretk">
                              <div className="sc-sx9n2y-0 bqwbXT css-zhpkf8">
                                Version: 7edf32
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Modal */}

              {/* Settings Modal End */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Modal;
