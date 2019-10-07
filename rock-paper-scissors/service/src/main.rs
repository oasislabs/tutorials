use oasis_std::{Address, Context};
#[macro_use]
extern crate serde;

#[derive(oasis_std::Service)]
struct RockPaperScissors {
    player_name: String,
    player_move: Move, // TODO would be better as an enum?
    challenger_name: String,
    challenger_move: Move,
    played: bool, // whether or not someone can challenge. true = player has played. false = nobody has played or just finished.
    challenged: bool,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub enum Move {
    Null,
    Rock,
    Paper,
    Scissors,
}

impl Move {
    fn compare(&self, challenger: &Self) -> i32 {
        if self.eq(&Move::Null) || challenger.eq(&Move::Null) {
            panic!("Trying to compare Null move!");
        }
        else if self.eq(&Move::Rock) {
            if challenger.eq(&Move::Rock) {
                return 0;
            } else if challenger.eq(&Move::Scissors) {
                return 1;
            } else {
                return -1;
            }
        }
        else if self.eq(&Move::Paper) {
            if challenger.eq(&Move::Rock) {
                return 1;
            } else if challenger.eq(&Move::Scissors) {
                return -1;
            } else {
                return 0;
            }
        }
        else {
            if challenger.eq(&Move::Rock) {
                return -1;
            } else if challenger.eq(&Move::Scissors) {
                return 0;
            } else  {
                return 1;
            }
        }
    }

    fn is_valid(&self) -> bool {
        if !self.eq(&Move::Rock) && !self.eq(&Move::Paper) && !self.eq(&Move::Scissors) {
            return false;
        } else {
            return true;
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub enum Error {
    GameNotFinished,
    AlreadyPlayed,
    AlreadyChallenged,
    InvalidMove
}

type Result<T> = std::result::Result<T, Error>;

impl RockPaperScissors {

    pub fn new(_ctx: &Context) -> Self {
        Self {
            player_name: "".to_string(),
            player_move: Move::Null,
            challenger_name: "".to_string(),
            challenger_move: Move::Null,
            played: false,
            challenged: false,
        }

    }

    pub fn can_play(&self, _ctx: &Context) -> bool {
        return !self.played;
    }

    pub fn can_challenge(&self, _ctx: &Context) -> bool {
        return !self.challenged;
    }

    pub fn reveal(&self, _ctx: &Context) -> Result<String> {
        if !self.played || !self.challenged {
            return Err(Error::GameNotFinished);
        }
        let result:i32 = self.player_move.compare(&self.challenger_move);
        if result == 0 {
            return Ok(format!("{} played {:?} and {} played {:?}. Tie!", self.player_name, self.player_move, self.challenger_name, self.challenger_move));
        }
        if result == 1 {
            return Ok(format!("{} played {:?} and {} played {:?}. Player Wins!", self.player_name, self.player_move, self.challenger_name, self.challenger_move));
        }
        // result == -1
        Ok(format!("{} played {:?} and {} played {:?}. Challenger Wins!", self.player_name, self.player_move, self.challenger_name, self.challenger_move))
    }

    pub fn play(&mut self, _ctx: &Context, p_name: String, p_move: Move) -> Result<String> {
        if self.played {
            return Err(Error::AlreadyPlayed);
        }
        if !p_move.is_valid() {
            return Err(Error::InvalidMove);
        }
        self.player_move = p_move;
        self.player_name = p_name;
        self.played = true;
        if self.played && self.challenged {
            return Ok("Both players have played. Use reveal() to see what both players' moves were.".to_string());
        }
        Ok(format!("Player {} has played.", self.player_name))
    }

    pub fn challenge(&mut self, _ctx: &Context, c_name: String, c_move: Move) -> Result<String> {
        if self.challenged {
            return Err(Error::AlreadyChallenged);
        }
        if !c_move.is_valid() {
            return Err(Error::InvalidMove);
        }
        self.challenger_move = c_move;
        self.challenger_name = c_name;
        self.challenged = true;
        if self.played && self.challenged {
            return Ok("Both players have played. Use reveal() to see what both players' moves were.".to_string());
        }
        Ok(format!("Player {} has played.", self.challenger_name))
    }
}


fn main() {
    oasis_std::service!(RockPaperScissors);
}

#[cfg(test)]
mod tests {
    extern crate oasis_test;

    use super::*;


    fn create_account() -> (Address, Context) {
        let sender = oasis_test::create_account(1);
        let ctx = Context::default().with_sender(sender);
        (sender, ctx)
    }

    #[test]
    fn functionality() {
        let (_player, player_ctx) = create_account();
        let (_challenger, challenger_ctx) = create_account();
        let mut game = RockPaperScissors::new(&player_ctx);

        assert_eq!(game.can_play(&player_ctx), true);
        assert_eq!(game.can_challenge(&player_ctx), true);
        // player 1 plays rock
        game.play(&player_ctx, "stan".to_string(), Move::Rock);
        // anyone can now challenge
        assert_eq!(game.can_play(&player_ctx), false);
        // challenger challenges, plays rock
        assert_eq!(game.can_challenge(&player_ctx), true);
        // challenger challenges, plays rock
        game.challenge(&challenger_ctx, "nick".to_string(), Move::Rock);
        // nobody can challenge anymore
        assert_eq!(game.can_challenge(&player_ctx), false);
        assert_eq!(game.reveal(&player_ctx).unwrap(), "stan played Rock and nick played Rock. Tie!");
    }

    #[test]
    fn repeats() {
        let (_player, player_ctx) = create_account();
        let (_challenger, challenger_ctx) = create_account();
        let mut game = RockPaperScissors::new(&player_ctx);

        assert_eq!(game.can_play(&player_ctx), true); // they can play in any order
        assert!(game.reveal(&player_ctx).is_err());

        // stan plays first, plays rock
        game.play(&player_ctx, "stan".to_string(), Move::Paper);
        // you can't play again
        assert!(game.play(&player_ctx, "mal".to_string(), Move::Scissors).is_err());

        // challenger challenges, plays rock
        game.challenge(&challenger_ctx, "nick".to_string(), Move::Paper);
        // you can't challenge again
        assert!(game.challenge(&challenger_ctx, "mal".to_string(), Move::Scissors).is_err());
        // nobody can challenge anymore
        assert_eq!(game.can_play(&player_ctx), false);
    }

    #[test]
    fn bad_moves() {
        let (_player, player_ctx) = create_account();
        let (_challenger, challenger_ctx) = create_account();
        let mut game = RockPaperScissors::new(&player_ctx);

        // you can't play an invalid move
        assert!(game.play(&player_ctx, "mal".to_string(), Move::Null).is_err());
        // you can't challenge an invalid move
        assert!(game.challenge(&challenger_ctx, "mal".to_string(), Move::Null).is_err());
    }
}
