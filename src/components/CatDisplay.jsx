import React from 'react';

import imgNormal from '../assets/cat_normal.png';
import imgUrgent from '../assets/cat_urgent.png';
import imgDone from '../assets/cat_done.png';
import imgGone from '../assets/cat_gone.png';

const CAT_IMAGES = {
    normal: imgNormal,
    urgent: imgUrgent,
    done: imgDone,
    gone: imgGone,
};

const CatDisplay = ({ catState }) => {
    // catState: 'normal' | 'urgent' | 'done' | 'gone'

    const imageSrc = CAT_IMAGES[catState] || CAT_IMAGES.normal;

    return (
        <div className="cat-display">
            <img src={imageSrc} alt={`Cat is ${catState}`} />
        </div>
    );
};

export default CatDisplay;
