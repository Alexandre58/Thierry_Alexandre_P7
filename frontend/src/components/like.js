import React from 'react';

import CardActions from '@material-ui/core/CardActions';

import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';

const Like = ()=> {
    return (
     
        <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
            <FavoriteIcon />
            </IconButton>
            
       </CardActions>
       
    );
};

export default Like;

//design like