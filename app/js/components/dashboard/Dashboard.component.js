import React from 'react';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card style={{width: '350px'}}>
                <CardTitle
                  avatar="https://placekitten.com/80/80/"
                  title="Avatar style title"
                  subtitle="Subtitle here"
                />
                <CardMedia
                  aspectRatio="wide"
                  image="https://placekitten.com/800/450/"
                />
                <CardTitle
                  title="Title goes here"
                  subtitle="Subtitle here"
                />
                <CardText>Some Dummy Text</CardText>
                <CardActions>
                  <Button label="Action 1" />
                  <Button label="Action 2" />
                </CardActions>
              </Card>
        );
    }
}

export default Dashboard;
