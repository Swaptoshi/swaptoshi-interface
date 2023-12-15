import React, { useState } from 'react';

import './Navbar.css';


function Nftbag({ handleCart }) {


    return (
        <div className="right-nav">

            <button
                className="_1klryar0 rgw6ez4ep rgw6ez1ad rgw6ez13d rgw6ez6fj _1973yvc1 rgw6ez3j rgw6ez4sd rgw6ez491 rgw6ez44v rgw6ez477 rgw6ez7iz rgw6ez47p rgw6ez46d rgw6ez79z rgw6ez7bb rgw6ez7on"
                aria-label="Navigation button"
                onClick={handleCart}
            >
                <svg
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    strokeWidth="2px"
                >
                    <path
                        d="M19.2893 5H4.5115C3.34557 5 2.40039 5.89543 2.40039 7V21C2.40039 22.1046 3.34557 23 4.5115 23H19.2893C20.4552 23 21.4004 22.1046 21.4004 21V7C21.4004 5.89543 20.4552 5 19.2893 5Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9 5L9 4.25C9 3.45435 9.31607 2.69129 9.87868 2.12868C10.4413 1.56607 11.2044 1.25 12 1.25C12.7957 1.25 13.5587 1.56607 14.1213 2.12868C14.6839 2.69129 15 3.45435 15 4.25L15 5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

        </div >
    );
}

export default Nftbag;

